import { corsHeaders } from '@supabase/supabase-js/cors';
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from 'npm:viem@2';
import { privateKeyToAccount } from 'npm:viem@2/accounts';
import { celo } from 'npm:viem@2/chains';

const CELOTIP_ADDRESS = "0x6b3A9c2b4b4BB24D5DFa59132499cb4Fd29C733e" as const;

const CELOTIP_ABI = [
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenAddress", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interactionType", type: "string" },
      { name: "castHash", type: "string" },
    ],
    name: "sendTip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RELAYER_PRIVATE_KEY = Deno.env.get('RELAYER_PRIVATE_KEY');
    if (!RELAYER_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: 'Relayer not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { from, to, tokenAddress, amount, interactionType, castHash } = await req.json();

    if (!from || !to || !tokenAddress || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields: from, to, tokenAddress, amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const publicClient = createPublicClient({
      chain: celo,
      transport: http('https://forno.celo.org'),
    });

    // Verify the user has approved enough tokens to the contract
    const allowance = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [from as `0x${string}`, CELOTIP_ADDRESS],
    });

    const parsedAmount = BigInt(amount);
    if (allowance < parsedAmount) {
      return new Response(JSON.stringify({ error: 'Insufficient token allowance. Please approve tokens first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create relayer wallet
    const key = RELAYER_PRIVATE_KEY.startsWith('0x') ? RELAYER_PRIVATE_KEY : `0x${RELAYER_PRIVATE_KEY}`;
    const account = privateKeyToAccount(key as `0x${string}`);
    
    const walletClient = createWalletClient({
      account,
      chain: celo,
      transport: http('https://forno.celo.org'),
    });

    // Send the tip via relayer
    const hash = await walletClient.writeContract({
      address: CELOTIP_ADDRESS,
      abi: CELOTIP_ABI,
      functionName: 'sendTip',
      args: [
        from as `0x${string}`,
        to as `0x${string}`,
        tokenAddress as `0x${string}`,
        parsedAmount,
        interactionType || 'tip',
        castHash || 'sent via CeloTip app',
      ],
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return new Response(JSON.stringify({ 
      success: true, 
      hash,
      status: receipt.status,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Send tip error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

import { useState, useMemo, useEffect } from "react";
import { formatUnits, parseUnits } from "viem";
import { CELOTIP_ADDRESS, ERC20_ABI, CELO_TOKENS } from "@/lib/contract";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { WalletType } from "@/hooks/useWallet";

interface TipFormProps {
  walletClient: any;
  publicClient: any;
  senderAddress: `0x${string}`;
  walletType: WalletType;
}

const PRESET_AMOUNTS = ["1", "5", "10", "25"];

export function TipForm({ walletClient, publicClient, senderAddress, walletType }: TipFormProps) {
  const availableTokens = useMemo(() => {
    if (walletType === "minipay") {
      return CELO_TOKENS.filter((t) => t.symbol !== "CELO");
    }
    return CELO_TOKENS;
  }, [walletType]);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(availableTokens.find(t => t.symbol === "cUSD") || availableTokens[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Fetch token balances
  useEffect(() => {
    const fetchBalances = async () => {
      setLoadingBalances(true);
      const newBalances: Record<string, string> = {};
      await Promise.all(
        availableTokens.map(async (token) => {
          try {
            const bal = await publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "balanceOf",
              args: [senderAddress],
            });
            newBalances[token.symbol] = parseFloat(formatUnits(bal as bigint, token.decimals)).toFixed(2);
          } catch {
            newBalances[token.symbol] = "—";
          }
        })
      );
      setBalances(newBalances);
      setLoadingBalances(false);
    };
    fetchBalances();
  }, [publicClient, senderAddress, availableTokens]);

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.error("Please fill in recipient and amount");
      return;
    }

    setSending(true);
    setStatus("");
    try {
      const parsedAmount = parseUnits(amount, selectedToken.decimals);
      const tokenAddress = selectedToken.address as `0x${string}`;
      const recipientAddress = recipient as `0x${string}`;

      // Step 1: Check balance
      setStatus("Checking balance...");
      try {
        const balance = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [senderAddress],
        });
        if ((balance as bigint) < parsedAmount) {
          toast.error(`Insufficient ${selectedToken.symbol} balance. You have ${formatUnits(balance as bigint, selectedToken.decimals)} ${selectedToken.symbol}`);
          setSending(false);
          setStatus("");
          return;
        }
      } catch {
        // Continue if balance check fails
      }

      // Step 2: Check allowance and approve if needed
      let needsApproval = true;
      try {
        const currentAllowance = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [senderAddress, CELOTIP_ADDRESS],
        });
        needsApproval = (currentAllowance as bigint) < parsedAmount;
      } catch {
        needsApproval = true;
      }

      if (needsApproval) {
        setStatus("Approving token spend...");
        toast.info("Please approve the token spend in your wallet");
        const approveHash = await walletClient.writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CELOTIP_ADDRESS, parsedAmount],
          account: senderAddress,
          chain: walletClient.chain,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        toast.success("Approval confirmed!");
      }

      // Step 3: Call backend relayer to send the tip
      setStatus("Sending tip via relayer...");
      toast.info("Sending tip...");

      const { data, error } = await supabase.functions.invoke('send-tip', {
        body: {
          from: senderAddress,
          to: recipientAddress,
          tokenAddress: tokenAddress,
          amount: parsedAmount.toString(),
          interactionType: "tip",
          castHash: message || "sent via CeloTip app",
        },
      });

      if (error) {
        throw new Error(error.message || "Backend relayer failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(`Tipped ${amount} ${selectedToken.symbol}! Tx: ${data.hash?.slice(0, 10)}...`);
      setAmount("");
      setRecipient("");
      setMessage("");
      setStatus("");

      // Refresh balance
      try {
        const newBal = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [senderAddress],
        });
        setBalances(prev => ({ ...prev, [selectedToken.symbol]: parseFloat(formatUnits(newBal as bigint, selectedToken.decimals)).toFixed(2) }));
      } catch { /* ignore */ }
    } catch (err: any) {
      console.error(err);
      const msg = err?.shortMessage || err?.message || "Transaction failed";
      if (msg.includes("insufficient funds") || msg.includes("INSUFFICIENT")) {
        toast.error("Not enough funds for gas. On MiniPay, ensure you have cUSD/cEUR for gas fees.");
      } else if (msg.includes("rejected") || msg.includes("denied")) {
        toast.error("Transaction was rejected");
      } else if (msg.includes("allowance")) {
        toast.error("Token approval insufficient. Please try again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSending(false);
      setStatus("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Token selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Token</label>
        <div className="flex gap-2">
          {availableTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
                selectedToken.symbol === token.symbol
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span>{token.symbol}</span>
              <span className={`text-[10px] mt-0.5 ${
                selectedToken.symbol === token.symbol
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}>
                {loadingBalances ? "..." : balances[token.symbol] ?? "—"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Recipient Address</label>
        <Input
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="font-mono text-sm bg-secondary border-border"
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Amount</label>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="font-mono text-lg bg-secondary border-border"
        />
        <div className="flex gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className="px-3 py-1.5 rounded-md text-xs font-mono bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              {preset} {selectedToken.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Message <span className="text-muted-foreground/50">(optional)</span>
        </label>
        <Input
          placeholder="Thanks for the great cast!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-secondary border-border"
        />
      </div>

      {/* Status */}
      {status && (
        <div className="text-xs text-muted-foreground text-center animate-pulse">
          {status}
        </div>
      )}

      {/* Send button */}
      <Button
        onClick={handleSend}
        disabled={sending || !recipient || !amount}
        className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow disabled:animate-none"
      >
        {sending ? "Sending..." : `Send ${amount || "0"} ${selectedToken.symbol}`}
      </Button>
    </div>
  );
}

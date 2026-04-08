export const CELOTIP_ADDRESS = "0x6b3A9c2b4b4BB24D5DFa59132499cb4Fd29C733e";

export const CELOTIP_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interactionType", type: "string" },
      { name: "castHash", type: "string" },
    ],
    name: "sendTip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
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
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

// Common Celo tokens
export const CELO_TOKENS = [
  { address: "0x471EcE3750Da237f93B8E339c536989b8978a438", symbol: "CELO", decimals: 18 },
  { address: "0x765DE816845861e75A25fCA122bb6898B8B1282a", symbol: "cUSD", decimals: 18 },
  { address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", symbol: "cEUR", decimals: 18 },
];

export const CELO_CHAIN_ID = 42220;
export const CELO_RPC = "https://forno.celo.org";

export const CELO_CHAIN_CONFIG = {
  chainId: "0xa4ec",
  chainName: "Celo Mainnet",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://celoscan.io"],
};

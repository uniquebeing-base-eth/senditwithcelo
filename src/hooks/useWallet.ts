import { useState, useCallback, useEffect } from "react";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celo } from "viem/chains";

export type WalletType = "minipay" | "valora" | "metamask" | "injected";

function detectWalletType(): WalletType {
  const eth = (window as any).ethereum;
  if (!eth) return "injected";
  if (eth.isMiniPay) return "minipay";
  if (eth.isValora) return "valora";
  if (eth.isMetaMask) return "metamask";
  return "injected";
}

export function useWallet() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [publicClient, setPublicClient] = useState<any>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>("injected");

  const setupClients = useCallback((eth: any, account: `0x${string}`) => {
    const wClient = createWalletClient({
      account,
      chain: celo,
      transport: custom(eth),
    });
    const pClient = createPublicClient({
      chain: celo,
      transport: custom(eth),
    });
    setWalletClient(wClient);
    setPublicClient(pClient);
    setAddress(account);
    setWalletType(detectWalletType());
  }, []);

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      throw new Error("No wallet detected. Please use MiniPay, Valora, or install MetaMask.");
    }

    setConnecting(true);
    try {
      const type = detectWalletType();
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts", params: [] });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // For non-Celo-native wallets, switch chain
      const isCeloNative = type === "minipay" || type === "valora";
      if (!isCeloNative) {
        const chainId = await eth.request({ method: "eth_chainId" });
        if (parseInt(chainId, 16) !== 42220) {
          try {
            await eth.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xa4ec" }],
            });
          } catch (e: any) {
            if (e.code === 4902) {
              await eth.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: "0xa4ec",
                  chainName: "Celo Mainnet",
                  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
                  rpcUrls: ["https://forno.celo.org"],
                  blockExplorerUrls: ["https://celoscan.io"],
                }],
              });
            } else {
              throw e;
            }
          }
        }
      }

      setupClients(eth, accounts[0] as `0x${string}`);
    } finally {
      setConnecting(false);
    }
  }, [setupClients]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletClient(null);
    setPublicClient(null);
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setupClients(eth, accounts[0] as `0x${string}`);
      }
    };

    const handleChainChanged = () => {
      if (address) {
        setupClients(eth, address);
      }
    };

    eth.on?.("accountsChanged", handleAccountsChanged);
    eth.on?.("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged);
      eth.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [address, disconnect, setupClients]);

  // Auto-connect
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    if (eth.isMiniPay) {
      connect().catch(console.error);
      return;
    }

    eth.request?.({ method: "eth_accounts", params: [] })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setupClients(eth, accounts[0] as `0x${string}`);
        }
      })
      .catch(console.error);
  }, [connect, setupClients]);

  return { address, walletClient, publicClient, connecting, connect, disconnect, walletType };
}

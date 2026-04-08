import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { CELO_CHAIN_CONFIG, CELO_CHAIN_ID } from "@/lib/contract";

type WalletType = "minipay" | "valora" | "metamask" | "injected";

function detectWalletType(): WalletType {
  const eth = (window as any).ethereum;
  if (!eth) return "injected";
  if (eth.isMiniPay) return "minipay";
  if (eth.isValora) return "valora";
  if (eth.isMetaMask) return "metamask";
  return "injected";
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>("injected");

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      throw new Error("No wallet detected. Please use MiniPay, Valora, or install MetaMask.");
    }

    setConnecting(true);
    try {
      const type = detectWalletType();
      setWalletType(type);

      // Request accounts
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts", params: [] });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // For MiniPay/Valora, skip chain switching - they're already on Celo
      const isCeloNative = type === "minipay" || type === "valora";
      
      if (!isCeloNative) {
        const chainId = await eth.request({ method: "eth_chainId" });
        if (parseInt(chainId, 16) !== CELO_CHAIN_ID) {
          try {
            await eth.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xa4ec" }],
            });
          } catch (e: any) {
            if (e.code === 4902) {
              await eth.request({
                method: "wallet_addEthereumChain",
                params: [CELO_CHAIN_CONFIG],
              });
            } else {
              throw e;
            }
          }
        }
      }

      // Create provider AFTER chain switching is complete
      const browserProvider = new BrowserProvider(eth);
      setProvider(browserProvider);
      setAddress(accounts[0]);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        setProvider(new BrowserProvider(eth));
      }
    };

    const handleChainChanged = () => {
      // Refresh provider on chain change
      if (address) {
        setProvider(new BrowserProvider(eth));
      }
    };

    eth.on?.("accountsChanged", handleAccountsChanged);
    eth.on?.("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged);
      eth.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [address, disconnect]);

  // Auto-connect if already authorized (for MiniPay which auto-injects)
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    // MiniPay auto-connects
    if (eth.isMiniPay) {
      connect().catch(console.error);
      return;
    }

    // For other wallets, check if already connected
    eth.request?.({ method: "eth_accounts", params: [] })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setWalletType(detectWalletType());
          setProvider(new BrowserProvider(eth));
        }
      })
      .catch(console.error);
  }, [connect]);

  return { address, provider, connecting, connect, disconnect, walletType };
}

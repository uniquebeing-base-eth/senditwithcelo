import { useState, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { CELO_CHAIN_CONFIG, CELO_CHAIN_ID } from "@/lib/contract";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!(window as any).ethereum) {
      throw new Error("Please install MetaMask or a compatible wallet");
    }
    setConnecting(true);
    try {
      const ethProvider = new BrowserProvider((window as any).ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      
      // Switch to Celo
      const chainId = await ethProvider.send("eth_chainId", []);
      if (parseInt(chainId, 16) !== CELO_CHAIN_ID) {
        try {
          await ethProvider.send("wallet_switchEthereumChain", [{ chainId: "0xa4ec" }]);
        } catch (e: any) {
          if (e.code === 4902) {
            await ethProvider.send("wallet_addEthereumChain", [CELO_CHAIN_CONFIG]);
          } else {
            throw e;
          }
        }
      }

      setAddress(accounts[0]);
      setProvider(new BrowserProvider((window as any).ethereum));
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  return { address, provider, connecting, connect, disconnect };
}

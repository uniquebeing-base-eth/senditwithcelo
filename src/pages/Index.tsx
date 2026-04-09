import { useWallet } from "@/hooks/useWallet";
import { TipForm } from "@/components/TipForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WALLET_LABELS: Record<string, string> = {
  minipay: "MiniPay",
  valora: "Valora",
  metamask: "MetaMask",
  injected: "Wallet",
};

const Index = () => {
  const { address, walletClient, publicClient, connecting, connect, disconnect, walletType } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err: any) {
      toast.error(err?.message || "Failed to connect wallet");
    }
  };

  const hasWallet = typeof window !== "undefined" && !!(window as any).ethereum;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="CeloTip" width={64} height={64} className="mx-auto" />
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Celo<span className="text-primary">Tip</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Send tips on Celo · Fast & simple
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg shadow-primary/5">
          {!address ? (
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl">💰</div>
              <p className="text-muted-foreground text-sm">
                Connect your wallet to start tipping
              </p>
              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
              {!hasWallet && (
                <p className="text-xs text-muted-foreground/70">
                  Works with{" "}
                  <a href="https://www.opera.com/products/minipay" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MiniPay</a>,{" "}
                  <a href="https://valoraapp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Valora</a>,{" "}
                  or <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MetaMask</a>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connected info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    {WALLET_LABELS[walletType] || "Wallet"}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disconnect
                </button>
              </div>

              <TipForm
                walletClient={walletClient!}
                publicClient={publicClient!}
                senderAddress={address}
                walletType={walletType}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50">
          Contract:{" "}
          <a
            href="https://celoscan.io/address/0x6b3a9c2b4b4bb24d5dfa59132499cb4fd29c733e"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-primary transition-colors"
          >
            0x6b3A...C733e
          </a>
        </p>
      </div>
    </div>
  );
};

export default Index;

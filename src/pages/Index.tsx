import { useWallet } from "@/hooks/useWallet";
import { TipForm } from "@/components/TipForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { address, provider, connecting, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
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
                onClick={connect}
                disabled={connecting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
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
                </div>
                <button
                  onClick={disconnect}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disconnect
                </button>
              </div>

              <TipForm provider={provider!} senderAddress={address} />
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

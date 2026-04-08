import { useState } from "react";
import { Contract, parseUnits } from "ethers";
import type { BrowserProvider } from "ethers";
import { CELOTIP_ADDRESS, CELOTIP_ABI, ERC20_ABI, CELO_TOKENS } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TipFormProps {
  provider: BrowserProvider;
  senderAddress: string;
}

const PRESET_AMOUNTS = ["1", "5", "10", "25"];

export function TipForm({ provider, senderAddress }: TipFormProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(CELO_TOKENS[1]); // cUSD default
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.error("Please fill in recipient and amount");
      return;
    }

    setSending(true);
    try {
      const signer = await provider.getSigner();
      const parsedAmount = parseUnits(amount, selectedToken.decimals);

      // Check allowance and approve if needed
      const tokenContract = new Contract(selectedToken.address, ERC20_ABI, signer);
      let needsApproval = true;

      try {
        const currentAllowance = await tokenContract.allowance(senderAddress, CELOTIP_ADDRESS);
        needsApproval = currentAllowance < parsedAmount;
      } catch {
        // Some wallets (MiniPay) may fail on allowance check — approve anyway
        needsApproval = true;
      }

      if (needsApproval) {
        toast.info("Approving token spend...");
        const approveTx = await tokenContract.approve(CELOTIP_ADDRESS, parsedAmount);
        await approveTx.wait();
        toast.success("Approval confirmed!");
      }

      // Send tip
      toast.info("Sending tip...");
      const tipContract = new Contract(CELOTIP_ADDRESS, CELOTIP_ABI, signer);
      const tx = await tipContract.sendTip(
        recipient,
        selectedToken.address,
        parsedAmount,
        "tip",
        message || "sent via CeloTip app"
      );
      await tx.wait();

      toast.success(`Tipped ${amount} ${selectedToken.symbol}!`);
      setAmount("");
      setRecipient("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.reason || err?.message || "Transaction failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Token</label>
        <div className="flex gap-2">
          {CELO_TOKENS.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token)}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
                selectedToken.symbol === token.symbol
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {token.symbol}
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

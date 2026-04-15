# 💰 CeloTip

CeloTip is a decentralized tipping platform built on the **Celo Blockchain**. It allows users to send tips using **CELO**, **cUSD**, and **cEUR** with a gasless experience powered by a backend relayer.

Designed for mobile-first accessibility, optimized for **Celo MiniPay**, **Valora**, and **MetaMask**.

---

## 🌟 Key Features

* **Gasless Tipping:** Users only approve token spending — the backend relayer handles transaction execution and gas fees.
* **Multi-Token Support:** Send tips in CELO, cUSD, or cEUR (MiniPay users: cUSD/cEUR only).
* **Mobile-First:** Fully optimized for MiniPay and Valora mobile wallets.
* **Smart Wallet Detection:** Automatically detects MiniPay, Valora, or MetaMask and adapts the UI accordingly.
* **On-Chain Transparency:** All tips are recorded on the Celo Mainnet smart contract.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 5, Tailwind CSS, TypeScript
* **Web3 / Blockchain:** Viem, Celo Mainnet
* **Backend:** Lovable Cloud (Edge Functions for relayer)
* **Smart Contract:** `0x6b3a9c2b4b4bb24d5dfa59132499cb4fd29c733e`
* **Relayer Address:** `0xad3e2d50c2d1581D60A2b228001eDEE456637233`

---

## ⚙️ Architecture

CeloTip uses a two-step transaction flow:

1. **User Approval:** The user's wallet signs a token `approve` transaction, granting the smart contract permission to spend the tip amount.
2. **Relayer Execution:** The backend relayer (Edge Function) calls `sendTip` on the smart contract using a secure private key, paying gas on behalf of the user.

This enables a **gasless experience** for end users — they only need tokens to tip, not gas to transact.

---

## 📱 MiniPay Integration

CeloTip is optimized for the [Celo MiniPay](https://www.opera.com/products/minipay) wallet:

### How It Works

1. **Auto-Detection:** The app detects `window.ethereum.isMiniPay` and auto-connects.
2. **Token Filtering:** MiniPay users only see cUSD and cEUR (CELO is filtered out as MiniPay is stablecoin-focused).
3. **No Chain Switching:** MiniPay is Celo-native, so no `wallet_switchEthereumChain` calls are made.
4. **Mobile-Optimized UI:** The interface adapts for small screens and touch interactions.

### Testing with MiniPay

1. Deploy or publish the app to a public URL.
2. Open the **Opera Mini** browser on Android.
3. Navigate to the **MiniPay** tab and enter your app URL.
4. The wallet will auto-connect and you can start tipping.

> **Note:** MiniPay only works on Celo Mainnet. Ensure the contract is deployed to mainnet before testing.

---

## 🚀 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/celotip.git
   cd celotip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:8080`

---

## 🔑 Environment Variables

The following environment variables are managed by Lovable Cloud:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key |
| `RELAYER_PRIVATE_KEY` | Backend relayer wallet private key (secret) |

> **Never commit private keys to GitHub.** The `RELAYER_PRIVATE_KEY` is stored securely as a backend secret.

---

## 🛡️ Security Architecture

* **Gasless Relayer:** The relayer private key is stored server-side in Edge Functions — never exposed to the browser.
* **Allowance Check:** The backend verifies on-chain token allowance before executing `sendTip`, preventing failed transactions.
* **Smart Contract:** All funds flow through the auditable on-chain contract.
* **RLS Policies:** Backend data access is protected by row-level security.

---

## 🤝 Supported Wallets

| Wallet | Auto-Connect | Chain Switch | Tokens |
|---|---|---|---|
| MiniPay | ✅ | Not needed | cUSD, cEUR |
| Valora | ❌ | Not needed | CELO, cUSD, cEUR |
| MetaMask | ❌ | ✅ Auto | CELO, cUSD, cEUR |

---

## 👨‍💻 Maintainer

Built with [Lovable](https://lovable.dev).

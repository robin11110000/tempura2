
# 🌊 **Tempura — A Decentralized Webtoon Platform Powered by Massa Network**

Tempura is a next-generation Webtoon platform built on the **Massa Network**, designed to give creators ownership, real-time audience engagement, and on-chain monetization.
Every creator, series, and episode is backed by verifiable on-chain state stored across Massa’s infrastructure, enabling a scalable, low-latency reading and publishing experience.

---

## 🚀 Vision

Traditional Webtoon platforms centralize data, revenue, and creative ownership.
Tempura flips this model:

* **Creators own their own on-chain identity/state**
* **Readers interact in real-time**
* **Episodes and metadata live on-chain**
* **Fan engagement + tipping + unlocks are built into the protocol**

Tempura is designed for the **Massa Hackathon** and showcases how Massa-native apps can deliver real-time, creator-centric digital publishing.

---

# 🔮 Core Features

## ⭐ ** On-Chain Publishing Protocol**

* Massa smart contract (e.g. via WebAssembly or native smart-contract framework)
* Register creators + their on-chain identity/account
* Create series
* Publish episodes (metadata + IPFS CIDs)
* Retrieve series & episode data through a Massa-compatible API / GraphQL / RPC service

## ⭐ ** Full Creator Tools**

* Creator Dashboard
* Series creation
* Episode uploading (multi-image)
* IPFS upload via Web3.Storage
* Publish episodes directly to the contract on Massa
* Contract address / creator account automatically shown in the UI

## ⭐ **Real-Time Reader Experience**

* Episode reader page
* Unlock episodes (on-chain, signed)
* Real-time comments and reactions (via on-chain events or off-chain + on-chain hybrid)
* On-chain metadata displayed in UI
* Persistent library, bookmarks, and history

## ⭐ **Token Economy**

* Daily token claim (24h cooldown)
* Tip creators on-chain (Massa native token)
* Wallet balance displayed globally
* Creator activity feeds
* Series-based engagement metrics

---

# 🧱 Architecture Overview

Tempura uses a **Massa-based model**:

| Component                          | On-chain / Off-chain Type                          | Description                                                       |
| ---------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **Main Contract (Publishing Hub)** | Massa smart contract / Program                     | Stores global registry: creators, series index, episode metadata  |
| **Creator Account / Sub-State**    | Creator’s on-chain identity/account                | Each creator owns an on-chain account holding their content/state |
| **Reader**                         | Wallet address / Account                           | Unlocks episodes and interacts with contract + creator account    |
| **API / GraphQL / RPC Service**    | Off-chain server interacting with Massa blockchain | Provides read/write access for frontend to contract and state     |

Frontend calls Massa through:

```
src/lib/massa.ts → JSON-RPC / Massa API → Contract + Account state → UI
```

---

# 📦 Tech Stack

* **Frontend:** React + Vite + shadcn/ui
* **Blockchain:** Massa Network (smart contracts / programs + accounts)
* **Storage:** IPFS via Web3.Storage
* **Wallet:** Massa-compatible wallet (e.g. Web wallet, CLI wallet)
* **Language:** TypeScript + smart-contract language supported by Massa

---

# 🖼️ On-Chain IDs & Contract / Account Info in UI

Tempura shows on-chain metadata inside the app:

* Contract address: Settings → **On-chain Info**
* Creator account / identity: Series header → **Creator Account**
* Episode unlock / publish events reference these on-chain addresses / IDs

This makes the system transparent for auditors & judges.

---

# 🌐 Frontend Commands

```bash
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

# 💾 Publishing Episodes (Flow)

1. Connect wallet (Massa)
2. Go to **Creator Dashboard** → New Series
3. Upload cover → Publish series
4. Go to **Publish Episode**
5. Upload images → IPFS stores them → Contract stores metadata on Massa
6. Reader sees the episode instantly in Explore + Home feeds

---

# 🧪 What Judges Should Test

✔ Register creator via UI / RPC
✔ Publish a series
✔ Upload an episode with metadata + IPFS link
✔ View contract & creator account info in Settings
✔ Unlock an episode (on-chain)
✔ Post a comment (real-time or hybrid)
✔ Tip a creator (token transfer)
✔ Check balance before & after claims / transfers

---

# 🏆 Why This Project Matters

* Demonstrates **real-world usage of Massa’s on-chain capabilities**
* Showcases how on-chain publishing + token economics can enable a **decentralized creator economy**
* Applies Web3 to a **100M+ reader market**
* Provides a full hackathon-ready MVP


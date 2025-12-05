
# 🌊 **Tempura — A Decentralized Webtoon Platform Powered by Linera Microchains**

Tempura is a next-generation Webtoon platform built on the **Linera blockchain**, designed to give creators ownership, real-time audience engagement, and on-chain monetization.
Every creator, series, and episode is backed by verifiable on-chain state stored across **Linera microchains**, enabling a scalable, low-latency reading and publishing experience.

---

## 🚀 Vision

Traditional Webtoon platforms centralize data, revenue, and creative ownership.
Tempura flips this model:

* **Creators own their microchains**
* **Readers interact in real-time**
* **Episodes and metadata live on-chain**
* **Fan engagement + tipping + unlocks are built into the protocol**

Tempura is designed for the **Linera Buildathon** and showcases how microchain-native apps can deliver real-time, creator-centric digital publishing.

---

# 🔮 Core Features

## ⭐ ** On-Chain Publishing Protocol**

* Linera AppChain smart contract (WASM)
* Register creators + their personal microchains
* Create series
* Publish episodes (metadata + IPFS CIDs)
* Retrieve series & episode data through Linera GraphQL

## ⭐ ** Full Creator Tools**

* Creator Dashboard
* Series creation
* Episode uploading (multi-image)
* IPFS upload via Web3.Storage
* Publish episodes directly to the AppChain
* Contract address automatically shown in the UI

## ⭐ **Real-Time Reader Experience**

* Episode reader page
* Unlock episodes (on-chain, signed)
* Real-time comments and reactions
* CreatorChain + AppChain metadata display in UI
* Persistent library, bookmarks, and history

## ⭐ **Token Economy**

* Daily token claim (24h cooldown)
* Tip creators on-chain
* Wallet balance displayed globally
* CreatorChain activity feeds
* Series-based engagement metrics

---

# 🧱 Architecture Overview

Tempura uses **Linera’s microchain model**:

| Component                       | Chain Type               | Description                                                     |
| ------------------------------- | ------------------------ | --------------------------------------------------------------- |
| **AppChain (Webtoon Contract)** | Linera application chain | Stores global registry, series, and marketplace logic           |
| **CreatorChain**                | Personal microchain      | Every creator owns a chain storing their series + episode state |
| **Reader**                      | Wallet address           | Unlocks episodes and interacts with AppChain + CreatorChain     |
| **GraphQL Service**             | `linera-service`         | Provides read/write access to chains for the frontend           |

Frontend calls Linera through:

```
src/lib/linera.ts → GraphQL → Linera nodes → Contract state
```

---

# 📦 Tech Stack

* **Frontend:** React + Vite + shadcn/ui
* **Blockchain:** Linera (Rust smart contracts → WASM → AppChain + microchains)
* **Storage:** IPFS via Web3.Storage
* **Wallet:** Linera wallet CLI (localnet)
* **Language:** TypeScript + Rust

---

# 🖼️ Microchain IDs & Contract Address in UI

Tempura shows on-chain metadata inside the app:

* App contract address: Settings → **On-chain Info**
* CreatorChain ID: Series header → **CreatorChain**
* Episode unlock / publish events reference these addresses

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

1. Connect wallet
2. Go to **Creator Dashboard** → New Series
3. Upload cover → Publish series
4. Go to **Publish Episode**
5. Upload images → IPFS stores them → AppChain stores metadata
6. Reader sees the episode instantly in Explore + Home feeds

---

# 🧪 What Judges Should Test

✔ Create a creator microchain
✔ Register creator via UI / GraphQL
✔ Publish a series
✔ Upload an episode
✔ View contract + microchain IDs in Settings
✔ Unlock an episode (on-chain)
✔ Post a comment (real-time)
✔ Tip a creator (token transfer)
✔ Check balance before & after claims

---

# 🏆 Why This Project Matters

* Demonstrates **real-world microchain usage**
* Showcases **Linera’s low-latency, horizontal scaling model**
* Applies Web3 to a **100M+ reader market**
* Builds a decentralized creator economy
* Includes Waves 1–4, making it a complete hackathon-ready MVP

---





# Orbitrum 🌌

**A Decentralized Webtoon Platform Built on Linera**

Orbitrum is a decentralized, creator-first Webtoon platform built on **Linera**, enabling real-time publishing, ownership, and monetization of episodic content using scalable microchains.

Creators publish **Series** and **Episodes** as on-chain applications, while readers enjoy a fast, seamless reading experience with verifiable ownership and censorship-resistant access.

---

## Why Orbitrum?

Traditional Webtoon platforms:

* Control distribution and discovery
* Take large revenue cuts
* Lock creators into centralized systems
* Offer no true digital ownership to readers

Orbitrum fixes this by leveraging Linera’s **low-latency, horizontally scalable blockchain architecture**.

---

## Core Features

### 🧑‍🎨 Creator-First Publishing

* Series and Episodes deployed as Linera applications
* Creators retain full ownership and control
* Permissionless publishing, no platform gatekeepers

### 📖 Reader Ownership

* Episodes are on-chain, verifiable, and permanent
* Access rights enforced by smart application logic
* Reader libraries are portable and censorship-resistant

### ⚡ Real-Time UX with Linera

* Sub-second finality using microchains
* Parallel execution per user / per series
* No congestion, no global bottlenecks

### 💰 Native Monetization

* Pay-per-episode
* Series passes
* Direct creator tipping
* Programmable revenue splits

---

## Architecture Overview

* **Linera Microchains**
  Each user and series operates on independent microchains for scalability.

* **Series Application**
  Manages metadata, episode registry, pricing, and permissions.

* **Episode Application**
  Handles content access, reader validation, and monetization logic.

* **Frontend**
  A web client that interacts directly with the Linera gateway.

---

## Tech Stack

* **Blockchain:** Linera
* **Smart Apps:** Rust → WASM
* **Frontend:** TypeScript / Web
* **Gateway:** Linera Service (local or networked)

---

## Repository Structure (High Level)

```
contracts/
  ├── series/     # Series Linera application
  └── episode/    # Episode Linera application

src/
  └── lib/
      └── linera.ts  # Gateway + Application IDs

frontend/
  └── web client
```

---

## Development Status

🚧 **Active Development**

Current focus:

* Series & Episode application deployment
* Frontend ↔ Linera integration
* Creator and reader flows

---

## Vision

Orbitrum aims to become the **decentralized standard for episodic storytelling**, where:

* Creators own their work
* Readers truly own access
* Infrastructure scales with demand
* Platforms don’t extract value from creativity

---



Just tell me what you want next.

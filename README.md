**🍤 TEMPURA**

A Decentralized Webtoon Publishing & Reading Platform Powered by Polygon

Tempura is a Polygon-native platform that transforms how Webtoon creators publish, monetize, and protect their work.

Readers unlock Webtoon episodes using on-chain payments, creators mint episodes as NFTs, and all assets live on decentralized storage.

Tempura blends Web3 ownership, creator-first economics, and a smooth reading experience into one platform.

**🎯 Mission**

To empower Webtoon creators with digital ownership, fair monetization, and global reach—without platform restrictions or middlemen.

To give readers a beautiful reading experience with provable ownership and censorship-resistant access.

Polygon’s low fees and scalability make Tempura possible at global scale.

**✨ Core Features**

**🖌️ Creator Tools**

Upload Webtoon episodes (multiple images / panels)

Store media and metadata on IPFS

Mint episodes as ERC-721 NFTs

Set creator royalties (ERC-2981)

Manage series and episodes from a dashboard

**📚 Reader Experience**

Smooth scrolling Webtoon-style reader (optimized for mobile + desktop)

Locked episodes until purchased with MATIC

On-chain ownership verifies access forever

“My Library” shows all owned episodes

**💸 On-Chain Economy**

Contracts deployed on Polygon Mumbai

EpisodeNFT contract for minting

Marketplace contract to buy/unlock episodes

Access Manager for content gating

Transparent creator revenue flow

**🔐 Wallet Integration**

Connect Wallet Button (thirdweb / MetaMask compatible)

Automatic chain switching to Polygon Mumbai

Secure signer for all on-chain actions

Storage: IPFS

Blockchain: Polygon Mumbai Testnet

Explorer: https://mumbai.polygonscan.com

**⚙️ Tech Stack**

Frontend

React

Vite

TypeScript

TailwindCSS

ShadCN UI

thirdweb (wallet + signer)

viem / ethers v6

nft.storage

Backend / Contracts

Solidity 0.8.x

Hardhat

OpenZeppelin ERC-721, ERC-2981

Polygon Mumbai RPC

**🔧 Local Installation**

1. Clone:

git clone https://github.com/robin11110000/tempura2

cd tempura2

2. Install dependencies:

npm install

3. Environment Variables:

Create .env:

VITE_MUMBAI_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
VITE_NFT_STORAGE_KEY=YOUR_NFT_STORAGE_KEY
VITE_THIRDWEB_CLIENT_ID=YOUR_CLIENT_ID

4. Run app:

npm run dev

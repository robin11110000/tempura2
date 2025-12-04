// EpisodeNFT Contract ABI and Address
// Deployed on Polygon Mumbai Testnet

export const EPISODE_NFT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace after deployment

export const EPISODE_NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "string", name: "metadataURI", type: "string" },
      { internalType: "uint256", name: "seriesId", type: "uint256" },
      { internalType: "uint256", name: "episodeNumber", type: "uint256" }
    ],
    name: "mintEpisode",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getEpisodeData",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "seriesId", type: "uint256" },
          { internalType: "uint256", name: "episodeNumber", type: "uint256" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "uint256", name: "mintedAt", type: "uint256" }
        ],
        internalType: "struct EpisodeNFT.EpisodeData",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// Polygon Mumbai Chain ID
export const POLYGON_MUMBAI_CHAIN_ID = 80001;

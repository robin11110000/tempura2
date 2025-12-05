import { ethers } from "ethers";

// Contract addresses (update after deployment)
export const SERIES_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
export const EPISODE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Types
export interface Series {
  id: number;
  title: string;
  description: string;
  coverURI: string;
  creator: string;
  episodeCount: number;
  createdAt: number;
}

export interface Episode {
  id: number;
  seriesId: number;
  episodeNumber: number;
  metadataURI: string;
  price: string;
  creator: string;
  publishedAt: number;
}

// ABIs
const SERIES_ABI = [
  "function createSeries(string title, string description, string coverURI) external returns (uint256)",
  "function getCreatorSeries(address creator) external view returns (tuple(uint256 id, string title, string description, string coverURI, address creator, uint256 episodeCount, uint256 createdAt)[])",
  "function getSeries(uint256 seriesId) external view returns (tuple(uint256 id, string title, string description, string coverURI, address creator, uint256 episodeCount, uint256 createdAt))",
  "event SeriesCreated(uint256 indexed seriesId, address indexed creator, string title)"
];

const EPISODE_ABI = [
  "function publishEpisode(uint256 seriesId, uint256 episodeNumber, string metadataURI, uint256 price) external returns (uint256)",
  "function getSeriesEpisodes(uint256 seriesId) external view returns (tuple(uint256 id, uint256 seriesId, uint256 episodeNumber, string metadataURI, uint256 price, address creator, uint256 publishedAt)[])",
  "event EpisodePublished(uint256 indexed episodeId, uint256 indexed seriesId, uint256 episodeNumber, address indexed creator)"
];

// Get provider and signer from window.ethereum
async function getProviderAndSigner() {
  if (!window.ethereum) {
    throw new Error("No wallet connected");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

// Create a new series
export async function createSeries(
  title: string,
  description: string,
  coverURI: string
): Promise<{ txHash: string; seriesId: number }> {
  const { signer } = await getProviderAndSigner();
  const contract = new ethers.Contract(SERIES_CONTRACT_ADDRESS, SERIES_ABI, signer);
  
  const tx = await contract.createSeries(title, description, coverURI);
  const receipt = await tx.wait();
  
  // Parse SeriesCreated event to get seriesId
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === "SeriesCreated";
    } catch {
      return false;
    }
  });
  
  let seriesId = 0;
  if (event) {
    const parsed = contract.interface.parseLog(event);
    seriesId = Number(parsed?.args[0] || 0);
  }
  
  return { txHash: receipt.hash, seriesId };
}

// Publish an episode
export async function publishEpisode(
  seriesId: number,
  episodeNumber: number,
  metadataURI: string,
  price: string
): Promise<{ txHash: string; episodeId: number }> {
  const { signer } = await getProviderAndSigner();
  const contract = new ethers.Contract(EPISODE_CONTRACT_ADDRESS, EPISODE_ABI, signer);
  
  const priceWei = ethers.parseEther(price);
  const tx = await contract.publishEpisode(seriesId, episodeNumber, metadataURI, priceWei);
  const receipt = await tx.wait();
  
  // Parse EpisodePublished event to get episodeId
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === "EpisodePublished";
    } catch {
      return false;
    }
  });
  
  let episodeId = 0;
  if (event) {
    const parsed = contract.interface.parseLog(event);
    episodeId = Number(parsed?.args[0] || 0);
  }
  
  return { txHash: receipt.hash, episodeId };
}

// Get all series created by a specific address
export async function getCreatorSeries(creatorAddress: string): Promise<Series[]> {
  const { provider } = await getProviderAndSigner();
  const contract = new ethers.Contract(SERIES_CONTRACT_ADDRESS, SERIES_ABI, provider);
  
  try {
    const series = await contract.getCreatorSeries(creatorAddress);
    return series.map((s: any) => ({
      id: Number(s.id),
      title: s.title,
      description: s.description,
      coverURI: s.coverURI,
      creator: s.creator,
      episodeCount: Number(s.episodeCount),
      createdAt: Number(s.createdAt),
    }));
  } catch {
    // Return empty array if contract not deployed or no series
    return [];
  }
}

// Get all episodes for a series
export async function getSeriesEpisodes(seriesId: number): Promise<Episode[]> {
  const { provider } = await getProviderAndSigner();
  const contract = new ethers.Contract(EPISODE_CONTRACT_ADDRESS, EPISODE_ABI, provider);
  
  try {
    const episodes = await contract.getSeriesEpisodes(seriesId);
    return episodes.map((e: any) => ({
      id: Number(e.id),
      seriesId: Number(e.seriesId),
      episodeNumber: Number(e.episodeNumber),
      metadataURI: e.metadataURI,
      price: ethers.formatEther(e.price),
      creator: e.creator,
      publishedAt: Number(e.publishedAt),
    }));
  } catch {
    return [];
  }
}

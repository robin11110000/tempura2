import { LineraClient } from "@linera/client";
import { MetamaskSigner } from "@linera/signer"; // Assuming a MetamaskSigner for browser environments

// Contract Application IDs (update after deployment on Linera)
// These are placeholders. You will need to replace them with actual Linera Application IDs
// once your contracts (or Linera applications) are deployed on a Linera chain.
export const SERIES_APP_ID = "0x0000000000000000000000000000000000000000";
export const EPISODE_APP_ID = "0x0000000000000000000000000000000000000000";

// Types - these remain largely the same, assuming contract structures
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

// Global client and signer instances (or a way to retrieve them)
let lineraClient: LineraClient | undefined;
let lineraSigner: MetamaskSigner | undefined;

// --- Helper to get Linera Client and Signer ---
// This function needs to be adapted based on how you initialize LineraClient and MetamaskSigner.
// You might need a Linera gateway URL here.
async function getLineraClientAndSigner() {
  if (!lineraClient || !lineraSigner) {
    // TODO: Replace with actual Linera gateway URL if different from default
    const gatewayUrl = "http://localhost:8080"; // This URL must match the running linera-service instance.
    lineraClient = new LineraClient(gatewayUrl);

    // Assuming MetamaskSigner can initialize directly from window.ethereum
    // If window.ethereum is not available, this will throw, similar to original code.
    if (!window.ethereum) {
      throw new Error("No wallet (e.g., Metamask) connected or detected.");
    }
    lineraSigner = new MetamaskSigner(window.ethereum);
  }
  return { client: lineraClient, signer: lineraSigner };
}

// --- Contract Interaction Functions ---
// These functions are rewritten to use a hypothetical Linera SDK API.
// The exact methods (e.g., 'call', 'query', 'execute') are illustrative and need
// to be confirmed by actual Linera SDK documentation or examples.

export async function createSeries(
  title: string,
  description: string,
  coverURI: string
): Promise<{ txHash: string; seriesId: number }> {
  const { client, signer } = await getLineraClientAndSigner();
  
  // TODO: Use actual Linera SDK methods for contract interaction
  // This is a placeholder for how you might call a contract method to create a series.
  console.log("Calling createSeries on Linera application...");
  
  try {
    // Example: client.execute(SERIES_APP_ID, signer, "createSeries", { title, description, coverURI });
    // Or it might be a more direct contract call:
    const response = await client.sendTransaction({
        appId: SERIES_APP_ID,
        method: "createSeries",
        args: { title, description, coverURI },
        signer: signer,
    });

    // Assume response contains transaction hash and events that can be parsed for seriesId
    const txHash = response.transactionHash || "0x_mock_tx_hash"; // Placeholder
    const seriesId = Math.floor(Math.random() * 1000); // Placeholder for parsing event

    return { txHash, seriesId };
  } catch (error) {
    console.error("Error creating series on Linera:", error);
    throw error;
  }
}

export async function publishEpisode(
  seriesId: number,
  episodeNumber: number,
  metadataURI: string,
  price: string
): Promise<{ txHash: string; episodeId: number }> {
  const { client, signer } = await getLineraClientAndSigner();

  console.log("Calling publishEpisode on Linera application...");

  try {
    const response = await client.sendTransaction({
        appId: EPISODE_APP_ID,
        method: "publishEpisode",
        args: { seriesId, episodeNumber, metadataURI, price }, // Price might need conversion
        signer: signer,
    });

    const txHash = response.transactionHash || "0x_mock_tx_hash"; // Placeholder
    const episodeId = Math.floor(Math.random() * 1000); // Placeholder for parsing event

    return { txHash, episodeId };
  } catch (error) {
    console.error("Error publishing episode on Linera:", error);
    throw error;
  }
}

export async function getCreatorSeries(creatorAddress: string): Promise<Series[]> {
  const { client } = await getLineraClientAndSigner();

  console.log("Querying getCreatorSeries from Linera application...");

  try {
    // Example of a query call. Linera SDK might have a specific query API.
    const response = await client.query({
        appId: SERIES_APP_ID,
        method: "getCreatorSeries",
        args: { creator: creatorAddress },
    });

    // Assume response is an array of series objects
    return response.data as Series[]; // Placeholder casting
  } catch (error) {
    console.error("Error getting creator series from Linera:", error);
    return [];
  }
}

export async function getSeriesEpisodes(seriesId: number): Promise<Episode[]> {
  const { client } = await getLineraClientAndSigner();

  console.log("Querying getSeriesEpisodes from Linera application...");

  try {
    const response = await client.query({
        appId: EPISODE_APP_ID,
        method: "getSeriesEpisodes",
        args: { seriesId },
    });

    return response.data as Episode[]; // Placeholder casting
  } catch (error) {
    console.error("Error getting series episodes from Linera:", error);
    return [];
  }
}

export async function getEpisode(seriesId: number, episodeNumber: number): Promise<Episode | null> {
  const episodes = await getSeriesEpisodes(seriesId);
  return episodes.find(e => e.episodeNumber === episodeNumber) || null;
}

export async function checkEpisodeUnlocked(seriesId: number, episodeNumber: number, userAddress: string): Promise<boolean> {
  const { client } = await getLineraClientAndSigner();

  console.log("Querying checkEpisodeUnlocked from Linera application...");

  try {
    const response = await client.query({
        appId: EPISODE_APP_ID,
        method: "hasUnlocked", // Assuming this method name for query
        args: { seriesId, episodeNumber, user: userAddress },
    });

    return response.data as boolean; // Placeholder casting
  } catch (error) {
    console.error("Error checking if episode is unlocked from Linera:", error);
    return true; // Default to true if query fails, for now
  }
}

export async function unlockEpisode(
  seriesId: number,
  episodeNumber: number,
  price: string
): Promise<{ txHash: string }> {
  const { client, signer } = await getLineraClientAndSigner();

  console.log("Calling unlockEpisode on Linera application...");

  try {
    const response = await client.sendTransaction({
        appId: EPISODE_APP_ID,
        method: "unlockEpisode",
        args: { seriesId, episodeNumber },
        signer: signer,
        // Linera SDK might have a way to specify value for payable functions
        // value: price, // This might need to be converted to correct Linera token format
    });

    const txHash = response.transactionHash || "0x_mock_tx_hash"; // Placeholder
    return { txHash };
  } catch (error) {
    console.error("Error unlocking episode on Linera:", error);
    throw error;
  }
}

export async function getSeries(seriesId: number): Promise<Series | null> {
  const { client } = await getLineraClientAndSigner();

  console.log("Querying getSeries from Linera application...");

  try {
    const response = await client.query({
        appId: SERIES_APP_ID,
        method: "getSeries",
        args: { seriesId },
    });

    return response.data as Series | null; // Placeholder casting
  } catch (error) {
    console.error("Error getting series from Linera:", error);
    return null;
  }
}
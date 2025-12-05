// Web3.Storage upload utilities
// Note: This uses a simplified approach for demo purposes
// In production, you'd use the full w3up-client with proper authentication

const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN;

// Upload a single file and return the CID
export async function uploadFile(file: File): Promise<string> {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error("VITE_WEB3_STORAGE_TOKEN not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  // Using web3.storage HTTP API
  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.cid;
}

// Upload multiple files and return the CID
export async function uploadFiles(files: File[]): Promise<string> {
  if (!WEB3_STORAGE_TOKEN) {
    throw new Error("VITE_WEB3_STORAGE_TOKEN not configured");
  }

  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append("file", file, `${index.toString().padStart(3, "0")}_${file.name}`);
  });

  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.cid;
}

// Upload JSON metadata and return the CID
export async function uploadJSON(metadata: object): Promise<string> {
  const blob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: "application/json",
  });
  const file = new File([blob], "metadata.json", { type: "application/json" });
  return uploadFile(file);
}

// Get IPFS gateway URL for a CID
export function getIPFSUrl(cid: string, filename?: string): string {
  const base = `https://${cid}.ipfs.w3s.link`;
  return filename ? `${base}/${filename}` : base;
}

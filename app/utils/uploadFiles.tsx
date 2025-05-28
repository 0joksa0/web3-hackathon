import React, { useState } from "react";
import { Send } from "lucide-react";
import { PinataSDK } from "pinata";

interface PinataProps { pinataGateway: string; jwt: string; }
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT || "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL || "https://gateway.pinata.cloud",
});

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}` },
    body: form,
  });
  const { IpfsHash } = await res.json();
  if (!IpfsHash) throw new Error("Pinata upload failed");
  return IpfsHash;
}

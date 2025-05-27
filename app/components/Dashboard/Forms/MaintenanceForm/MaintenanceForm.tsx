import React, { useState } from "react";
import { Send } from "lucide-react";
import { PinataSDK } from "pinata";

interface MaintenanceFormProps {
  onSubmit: (part: string, hash: string, note: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function MaintenanceForm({ onSubmit, onCancel, disabled }: MaintenanceFormProps) {
  const [part, setPart] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const pinata = new PinataSDK({
    pinataJwt: "",
    pinataGateway: import.meta.env.VITE_GATEWAY_URL,
  });

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }
    setStatus("Uploading…");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}` },
        body: formData,
      });
      const { IpfsHash } = await res.json();
      if (!IpfsHash) throw new Error("Pinata upload failed");

      setStatus("Upload complete ✔");
      onSubmit(part, IpfsHash, note);
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="part" className="block text-sm font-medium text-gray-300">
          Part name
        </label>
        <input
          id="part"
          type="text"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          placeholder="e.g. Brake pad"
          className="mt-1 block w-full bg-[#111]/50 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-300">
          Upload document or image
        </label>
        <input
          id="file"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-200
            file:mr-4 file:py-2 file:px-4 file:rounded-lg
            file:border-0 file:bg-white/10 file:text-gray-200
            hover:file:bg-white/20"
        />
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-300">
          Note
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any remarks…"
          className="mt-1 block w-full bg-[#111]/50 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {status && <p className="text-sm text-gray-400">{status}</p>}

      <div className="flex space-x-2">
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
        >
          <Send size={16} className="mr-2" /> Add
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}


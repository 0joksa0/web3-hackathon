import { Send } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "~/utils/uploadFiles";

export function AccidentForm({
  onSubmit,
  onCancel,
  disabled,
}: {
  onSubmit: (photoCid: string, desc: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");

  const handle = async () => {
    if (!file) { setStatus("Select photo"); return; }
    setStatus("Uploading photo…");
    try {
      const cid = await uploadFile(file);
      setStatus("Upload OK – submitting");
      onSubmit(cid, desc);
      setStatus("");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="form-card">
            <p className="text-lg font-semibold">Add accident</p>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="form-input"
      />      

      <textarea
        rows={2}
        placeholder="Accident details"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        className="form-input"
      />
      {status && <p className="text-sm text-gray-400">{status}</p>}
      <div className="flex space-x-2">
        <button onClick={handle} disabled={disabled} className="btn-primary">
          <Send size={16} className="mr-2"/>Submit
        </button>
        {onCancel && <button onClick={onCancel} className="btn-secondary">Cancel</button>}
      </div>
    </div>
  );
}


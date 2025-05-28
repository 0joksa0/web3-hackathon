import { Send } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "~/utils/uploadFiles";

export function DiagnosticForm({
    onSubmit,
    onCancel,
    disabled,
}: {
    onSubmit: (cid: string, summary: string, mileage: string) => void;
    onCancel?: () => void;
    disabled?: boolean;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState("");
    const [status, setStatus] = useState("");

    const [mileage, setMileage] = useState("");
    const handle = async () => {
        if (!file) { setStatus("Select JSON file"); return; }
        setStatus("Uploading JSON…");
        try {
            const cid = await uploadFile(file);
            setStatus("Upload OK – submitting");
            onSubmit(cid, summary, mileage);
            setStatus("");
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        }
    };

    return (
        <div className="form-card">
            <p className="text-lg font-semibold">Add Diagnostic</p>
            <input
                type="file"
                accept="application/json"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="form-input"
            />
            <input
                type="text"
                placeholder="Current mileage"
                value={mileage}
                onChange={e => setMileage(e.target.value)}
                className="form-input"
            />
            <input
                type="text"
                placeholder="Summary text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="form-input"
            />
            {status && <p className="text-sm text-gray-400">{status}</p>}
            <div className="flex space-x-2">
                <button onClick={handle} disabled={disabled} className="btn-primary">
                    <Send size={16} className="mr-2" />Submit
                </button>
                {onCancel && <button onClick={onCancel} className="btn-secondary">Cancel</button>}
            </div>
        </div>
    );
}


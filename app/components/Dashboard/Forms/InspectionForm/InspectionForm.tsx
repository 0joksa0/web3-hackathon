import { Send } from "lucide-react";
import { useState } from "react";
import { uploadFile } from "~/utils/uploadFiles";

export function InspectionForm({
    onSubmit,
    onCancel,
    disabled,
}: {
    onSubmit: (passed: boolean, cid: string, mileage: string) => void;
    onCancel?: () => void;
    disabled?: boolean;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [passed, setPassed] = useState(false);
    const [status, setStatus] = useState("");

    const [mileage, setMileage] = useState("");
    const handle = async () => {
        if (!file) { setStatus("Select report file"); return; }
        setStatus("Uploading report…");
        try {
            const cid = await uploadFile(file);
            setStatus("Upload OK – submitting");
            onSubmit(passed, cid, mileage);
            setStatus("");
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        }
    };

    return (
        <div className="form-card">
            <p className="text-lg font-semibold">Add Inspection</p>
            <div className="flex items-center space-x-2">
                <label className="form-lable">
                    <input type="checkbox" checked={passed} onChange={e => setPassed(e.target.checked)} className="mr-2" />
                    Passed
                </label>
            </div>
            <input
                type="text"
                placeholder="Current mileage"
                value={mileage}
                onChange={e => setMileage(e.target.value)}
                className="form-input"
            />
            <input
                type="file"
                accept="application/pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
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

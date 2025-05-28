import { Send } from "lucide-react";
import { useState } from "react";

export function TransferOwnershipForm({
    onSubmit,
    onCancel,
    disabled,
}: {
    onSubmit: (newOwner: string) => void;
    onCancel?: () => void;
    disabled?: boolean;
}) {
    const [newOwner, setNewOwner] = useState("");

    return (
        <div className="form-card">
            <input
                type="text"
                placeholder="New owner address"
                value={newOwner}
                onChange={e => setNewOwner(e.target.value)}
                className="form-input"
            />
            <div className="flex space-x-2">
                <button onClick={() => onSubmit(newOwner)} disabled={disabled} className="btn-primary">
                    <Send size={14} />
                    Transfer
                </button>
                {onCancel && <button onClick={onCancel} className="btn-secondary">Cancel</button>}
            </div>
        </div>
    );
}


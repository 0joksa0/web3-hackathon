
// components/forms/MaintenanceForm.tsx
import { useState } from "react";
import { Send } from "lucide-react";

export function RegisterVehicle({ onSubmit, disabled }: {
    onSubmit: (vin: string, year: string) => void;
    disabled?: boolean;
}) {
    const [vin, setVin] = useState("");
    const [year, setYear] = useState("");

    return (
        <div className="space-y-2">
            <input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Vin" className="input" />
  <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="input" />
            <button onClick={() => onSubmit(vin,year)} disabled={disabled}
                className="btn"><Send size={14} /> Add</button>
        </div>
    );
}


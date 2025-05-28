
// components/forms/MaintenanceForm.tsx
import { useState } from "react";
import { Send } from "lucide-react";

export function RegisterVehicle({ onSubmit, disabled }: {
    onSubmit: (vin: string, year: string, mileage: string) => void;
    disabled?: boolean;
}) {
    const [vin, setVin] = useState("");
    const [year, setYear] = useState("");

    const [mileage, setMileage] = useState("");
    return (
        <div className="form-card">
            <input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Vin" className="form-input" />
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="form-input" />
            <input
                type="text"
                placeholder="Current mileage"
                value={mileage}
                onChange={e => setMileage(e.target.value)}
                className="form-input"
            />


            <button onClick={() => onSubmit(vin, year, mileage)} disabled={disabled}
                className="btn-primary"><Send size={14} /> Add</button>
        </div>
    );
}


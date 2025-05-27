export function VinInput({ vin, setVin, onLoad }: {
  vin: string; setVin: (v: string) => void; onLoad: () => void;
}) {
  return (
    <div className="flex gap-3">
      <input
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        placeholder="VIN e.g. WVWZZZ..."
        className="rounded bg-[#111] p-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500 w-72"
      />
      <button
        onClick={onLoad}
        className="rounded bg-cyan-600 px-5 font-semibold hover:bg-cyan-500 transition"
      >
        Load
      </button>
    </div>
  );
}


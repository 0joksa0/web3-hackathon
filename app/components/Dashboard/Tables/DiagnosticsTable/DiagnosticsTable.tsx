import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Table } from "../Table";

export function DiagnosticsTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;

  return (
    <Table
      title="Diagnostics"
      cols={["Timestamp", "OBD CID", "Summary CID", "Mechanic"]}
      rows={rows.map((r) => ({
        Timestamp: format(new Date(Number(r.ts) * 1000), "dd.MM.yyyy HH:mm"),
        "OBD CID": <span className="text-xs break-all">{r.cid}</span>,
        "Summary CID": <span className="text-xs break-all">{r.summaryCid}</span>,
        Mechanic: <span className="text-xs break-all">{r.mechanic}</span>,
      }))}
    />
  );
}


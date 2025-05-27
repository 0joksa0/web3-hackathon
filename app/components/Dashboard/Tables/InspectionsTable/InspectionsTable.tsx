import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Table } from "../Table";

export function InspectionsTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;

  return (
    <Table
      title="Inspections"
      cols={["Timestamp", "Passed", "Report CID", "Inspector"]}
      rows={rows.map((r) => ({
        Timestamp: format(new Date(Number(r.ts) * 1000), "dd.MM.yyyy HH:mm"),
        Passed: r.passed ? "✅ Yes" : "❌ No",
        "Report CID": <span className="text-xs break-all">{r.cid}</span>,
        Inspector: <span className="text-xs break-all">{r.inspector}</span>,
      }))}
    />
  );
}


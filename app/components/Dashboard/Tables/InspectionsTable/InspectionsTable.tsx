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
        "Report CID": (
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://ipfs.io/ipfs/${r.insIpfs}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                            title="View on IPFS"
                        >
                            <Eye size={16} />
                        </a>
                    </div>
                ),
        Inspector: <span className="text-xs break-all">{r.inspector}</span>,
      }))}
    />
  );
}


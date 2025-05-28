import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Table } from "../Table";
import { bytes32ToStr } from "~/utils/helper";

export function DiagnosticsTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;

  return (
    <Table
      title="Diagnostics"
      cols={["Timestamp", "OBD", "Summary", "Mechanic"]}
      rows={rows.map((r) => ({
        Timestamp: format(new Date(Number(r.ts) * 1000), "dd.MM.yyyy HH:mm"),
        "OBD": (
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://ipfs.io/ipfs/${r.digIpfs}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                            title="View on IPFS"
                        >
                            <Eye size={16} />
                        </a>
                    </div>
                ),

        "Summary": <span className="text-xs break-all">{bytes32ToStr(r.summary)}</span>,
        Mechanic: <span className="text-xs break-all">{r.mechanic}</span>,
      }))}
    />
  );
}


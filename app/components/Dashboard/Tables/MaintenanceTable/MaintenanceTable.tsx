// components/tables/MaintenanceTable.tsx
import { format } from "date-fns";
import { bytes32ToStr } from "~/utils/helper";
import { Eye } from "lucide-react";
import { Table } from "../Table";

export function MaintenanceTable({ rows }: { rows: any[] }) {
    if (!rows.length) return null;

    return (
        <Table
            title="Maintenance Log"
            cols={["Timestamp", "Part (CID/IPFS)", "Note (CID)", "Mechanic"]}
            rows={rows.map((r) => ({
                Timestamp: format(new Date(Number(r.ts) * 1000), "dd.MM.yyyy HH:mm"),
                "Part (CID/IPFS)": (
                    <div className="flex items-center gap-2">
                        <span className="text-xs break-all">{bytes32ToStr(r.part)}</span>
                        <a
                            href={`https://ipfs.io/ipfs/${r.partIpfs}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                            title="View on IPFS"
                        >
                            <Eye size={16} />
                        </a>
                    </div>
                ),
                "Note (CID)": <span className="text-xs break-all">{bytes32ToStr(r.note)}</span>,
                Mechanic: <span className="text-xs break-all">{r.mechanic}</span>,
            }))}
        />
    );
}


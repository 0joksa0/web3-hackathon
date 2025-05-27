import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Table } from "../Table";

export function AccidentsTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;

  return (
    <Table
      title="Accidents"
      cols={["Timestamp", "Photo", "Description", "Reporter"]}
      rows={rows.map((r) => ({
        Timestamp: format(new Date(Number(r.ts) * 1000), "dd.MM.yyyy HH:mm"),
        Photo: (
          <a
            href={`https://ipfs.io/ipfs/${r.photoCid}`}
            target="_blank"
            rel="noreferrer"
            title="View Photo"
          >
            <Eye size={16} />
          </a>
        ),
        Description: <span className="text-xs break-all">{r.descCid}</span>,
        Reporter: <span className="text-xs break-all">{r.reporter}</span>,
      }))}
    />
  );
}


// src/components/Dashboard/Tables/OwnershipHistoryTable/OwnershipHistoryTable.tsx
import { format } from "date-fns";
import { Table } from "../Table";

export function OwnershipHistoryTable({ rows }: { rows: any[] }) {
  if (!rows.length) return null;

  return (
    <Table
      title="Ownership History"
      cols={["Owner", "From", "To"]}
      rows={rows.map((r) => ({
        Owner: <span className="text-xs break-all">{r.owner}</span>,
        From: format(new Date(Number(r.from) * 1000), "dd.MM.yyyy HH:mm"),
        To:
          r.to.toString() === "0"
            ? "Present"
            : format(new Date(Number(r.to) * 1000), "dd.MM.yyyy HH:mm"),
      }))}
    />
  );
}


export function Table({
  title,
  cols,
  rows,
}: {
  title: string;
  cols: string[];
  rows: any[];
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-2 font-semibold">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#111] text-gray-400">
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-4 py-2 whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/10">
                {cols.map((c) => (
                  <td key={c} className="px-4 py-2 align-top">
                    {r[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


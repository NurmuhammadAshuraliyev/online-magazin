export const Table = ({ headers, data, renderRow }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
          <tr>
            {headers.map((h, i) => <th key={i} className="px-6 py-4">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, i) => renderRow(item, i))}
        </tbody>
      </table>
    </div>
  );
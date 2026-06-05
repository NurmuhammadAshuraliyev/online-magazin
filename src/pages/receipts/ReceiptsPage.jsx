import { Eye, Printer, Download } from "lucide-react";

export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sotuv Cheklari</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">#{id}024</div>
              <div>
                <p className="font-bold text-slate-800">1,450,000 UZS</p>
                <p className="text-xs text-slate-500">11 Aprel, 2024 • 14:20</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700">Mijoz: Chakana</p>
                <p className="text-xs text-slate-400">Kassir: Admin</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"><Eye size={20}/></button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Printer size={20}/></button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={20}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
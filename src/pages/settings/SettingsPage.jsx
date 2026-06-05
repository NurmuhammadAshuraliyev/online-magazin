import { Store, Phone, MapPin, Save, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sozlamalar</h1>
        <p className="text-slate-500">Do'kon va tizim ma'lumotlarini boshqarish</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Store size={16}/> Do'kon nomi</label>
              <input type="text" defaultValue="StockPro Premium" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={16}/> Telefon raqami</label>
              <input type="text" defaultValue="+998 90 123 45 67" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16}/> Manzil</label>
              <input type="text" defaultValue="Toshkent sh., Chilonzor tumani, 14-kvartal" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Chek uchun yakuniy so'z (Footer text)</label>
              <textarea rows="3" defaultValue="Xaridingiz uchun rahmat! Bizning mahsulotlar sifatiga kafolat beramiz." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none resize-none"></textarea>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-50 flex justify-end">
            <button className="gradient-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 flex items-center gap-2 active:scale-95 transition-transform">
              <Save size={20} /> O'zgarishlarni Saqlash
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-bold">Xavfsizlik</p>
            <p className="text-slate-400 text-sm">Oxirgi marta parol 2 oy avval o'zgartirilgan</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">O'zgartirish</button>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import {
//   BarChart3,
//   ArrowDownCircle,
//   ShoppingBag,
//   CreditCard,
//   Wallet,
//   UserCheck,
// } from "lucide-react";

// export default function ReportsPage() {
//   const [sales, setSales] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [filter, setFilter] = useState("day");

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/api/dashboard/statistika"
//         );

//         const data = await res.json();

//         console.log(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     loadData();
//   }, []);

//   const getFilteredData = (data) => {
//     if (!Array.isArray(data)) return [];

//     const now = new Date();

//     return data.filter((item) => {
//       if (!item.date) return false;

//       const itemDate = new Date(item.date);

//       if (filter === "day") {
//         return itemDate.toDateString() === now.toDateString();
//       }

//       if (filter === "week") {
//         const weekAgo = new Date();
//         weekAgo.setDate(now.getDate() - 7);
//         return itemDate >= weekAgo && itemDate <= now;
//       }

//       if (filter === "month") {
//         return (
//           itemDate.getMonth() === now.getMonth() &&
//           itemDate.getFullYear() === now.getFullYear()
//         );
//       }

//       if (filter === "year") {
//         return itemDate.getFullYear() === now.getFullYear();
//       }

//       return true;
//     });
//   };

//   const filteredSales = getFilteredData(sales);
//   const filteredPayments = getFilteredData(payments);

//   const stats = {
//     totalSales: filteredSales.reduce(
//       (sum, s) => sum + Number(s.totalAmount || 0),
//       0
//     ),

//     totalProfit: filteredSales.reduce(
//       (sum, s) => sum + Number(s.profit || 0),
//       0
//     ),

//     cashSales: filteredSales
//       .filter((s) => s.paymentMethod === "naqd")
//       .reduce((sum, s) => sum + Number(s.totalAmount || 0), 0),

//     cardSales: filteredSales
//       .filter((s) => s.paymentMethod === "karta")
//       .reduce((sum, s) => sum + Number(s.totalAmount || 0), 0),

//     debtSales: filteredSales
//       .filter((s) => s.paymentMethod === "nasiya")
//       .reduce((sum, s) => sum + Number(s.totalAmount || 0), 0),

//     receivedDebts: filteredPayments.reduce(
//       (sum, p) => sum + Number(p.amount || 0),
//       0
//     ),
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 italic font-bold text-slate-900">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* HEADER & FILTERS */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
//               <BarChart3 size={24} />
//             </div>

//             <h1 className="text-2xl font-black uppercase italic">
//               Hisobotlar
//             </h1>
//           </div>

//           <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
//             {[
//               { id: "day", name: "Kun" },
//               { id: "week", name: "Hafta" },
//               { id: "month", name: "Oy" },
//               { id: "year", name: "Yil" },
//             ].map((f) => (
//               <button
//                 key={f.id}
//                 onClick={() => setFilter(f.id)}
//                 className={`px-6 py-2.5 rounded-xl uppercase text-[10px] font-black transition-all ${
//                   filter === f.id
//                     ? "bg-white text-slate-900 shadow-sm"
//                     : "text-slate-400 hover:text-slate-600"
//                 }`}
//               >
//                 {f.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* SUMMARY CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl">
//             <p className="text-[10px] uppercase text-slate-500 mb-1">
//               Umumiy Savdo
//             </p>

//             <h2 className="text-3xl font-black">
//               {stats.totalSales.toLocaleString()} UZS
//             </h2>

//             <div className="mt-4 flex gap-4 text-[9px] opacity-70">
//               <span className="flex items-center gap-1">
//                 <Wallet size={12} /> Naqd: {stats.cashSales.toLocaleString()}
//               </span>

//               <span className="flex items-center gap-1">
//                 <CreditCard size={12} /> Karta:{" "}
//                 {stats.cardSales.toLocaleString()}
//               </span>
//             </div>
//           </div>

//           <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
//             <p className="text-[10px] uppercase text-slate-400 mb-1">
//               Sof Foyda
//             </p>

//             <h2 className="text-3xl font-black text-emerald-600">
//               {stats.totalProfit.toLocaleString()} UZS
//             </h2>

//             <p className="text-[9px] mt-2 text-emerald-500 italic uppercase">
//               Tannarxdan tashqari
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
//             <p className="text-[10px] uppercase text-slate-400 mb-1">
//               Undirilgan qarzlar
//             </p>

//             <h2 className="text-3xl font-black text-blue-600">
//               {stats.receivedDebts.toLocaleString()} UZS
//             </h2>

//             <p className="text-[9px] mt-2 text-blue-400 uppercase italic">
//               Kassaga kirgan qarz pullari
//             </p>
//           </div>
//         </div>

//         {/* DETAILS TABLE */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* SAVDO TARIXI RO'YXATI */}
//           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
//             <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
//               <ShoppingBag className="text-emerald-500" /> Savdo Tarixi
//             </h3>

//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//               {filteredSales.length === 0 ? (
//                 <p className="text-center py-10 text-slate-300 uppercase text-[10px]">
//                   Ma'lumot yo'q
//                 </p>
//               ) : (
//                 [...filteredSales].reverse().map((sale, index) => (
//                   <div
//                     key={sale.id || index}
//                     className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"
//                   >
//                     <div>
//                       <p className="text-xs font-black uppercase">
//                         {sale.customerName || "Noma'lum"}
//                       </p>

//                       <p className="text-[9px] text-slate-400 uppercase">
//                         {sale.paymentMethod || "naqd"} •{" "}
//                         {sale.date
//                           ? new Date(sale.date).toLocaleTimeString()
//                           : "--:--"}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-sm font-black">
//                         {Number(sale.totalAmount || 0).toLocaleString()} UZS
//                       </p>

//                       <p className="text-[9px] text-emerald-500">
//                         +{Number(sale.profit || 0).toLocaleString()} foyda
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* QARZ TO'LOVLARI RO'YXATI */}
//           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
//             <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
//               <UserCheck className="text-blue-500" /> Undirilgan qarzlar
//             </h3>

//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//               {filteredPayments.length === 0 ? (
//                 <p className="text-center py-10 text-slate-300 uppercase text-[10px]">
//                   Ma'lumot yo'q
//                 </p>
//               ) : (
//                 [...filteredPayments].reverse().map((pay, index) => (
//                   <div
//                     key={pay.id || index}
//                     className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
//                         <ArrowDownCircle size={16} />
//                       </div>

//                       <div>
//                         <p className="text-xs font-black uppercase">
//                           {pay.customerName || "Noma'lum"}
//                         </p>

//                         <p className="text-[9px] text-blue-400 uppercase">
//                           {pay.date ? new Date(pay.date).toLocaleString() : ""}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="text-sm font-black text-blue-600">
//                       +{Number(pay.amount || 0).toLocaleString()} UZS
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ////////
// import React, { useEffect, useState } from "react";
// import { BarChart3, RefreshCw } from "lucide-react";

// export default function ReportsPage() {
//   const [data, setData] = useState(null);
//   const [filter, setFilter] = useState("kun");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ================= SAFE NUMBER =================
//   const n = (v) => {
//     if (v === null || v === undefined) return 0;
//     if (typeof v === "number") return v;
//     if (typeof v === "string") return Number(v) || 0;
//     if (typeof v === "object") {
//       return Number(v.summa || v.amount || v.value || v.total || 0);
//     }
//     return 0;
//   };

//   // ================= FETCH API WITH FILTER =================
//   const fetchData = async (selectedFilter) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("user_token");

//       const res = await fetch(
//         `https://sifat-pmy2.onrender.com/api/hisobot?filter=${selectedFilter}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) throw new Error("Server error: " + res.status);

//       const json = await res.json();

//       console.log("FILTER DATA:", selectedFilter, json);

//       setData(json);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(filter);
//   }, [filter]);

//   // ================= DATA =================
//   const sales = Array.isArray(data?.savdoTarixi) ? data.savdoTarixi : [];
//   const payments = Array.isArray(data?.qarzTolovalari)
//     ? data.qarzTolovalari
//     : [];

//   // ================= STATS =================
//   const totalSales = sales.reduce((s, i) => s + n(i.summa), 0);

//   const totalProfit = sales.reduce((sum, sale) => {
//     const items = sale.mahsulotlar || [];
//     return sum + items.reduce((a, b) => a + n(b.foyda), 0);
//   }, 0);

//   const cashSales = sales
//     .filter((s) => s.tolovTuri === "NAQD")
//     .reduce((a, b) => a + n(b.summa), 0);
//   const cardSales = sales
//     .filter((s) => s.tolovTuri === "KARTA")
//     .reduce((a, b) => a + n(b.summa), 0);
//   const debtSales = sales
//     .filter((s) => s.tolovTuri === "NASIYA")
//     .reduce((a, b) => a + n(b.summa), 0);

//   const receivedDebts = payments.reduce((s, i) => s + n(i.amount), 0);

//   // ================= FILTER BUTTONS =================
//   const filters = [
//     { id: "kun", label: "Kun" },
//     { id: "hafta", label: "Hafta" },
//     { id: "oy", label: "Oy" },
//     { id: "yil", label: "Yil" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-bold italic">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex justify-between items-center bg-white p-8 rounded-[3rem]">
//           <div className="flex items-center gap-3">
//             <BarChart3 />
//             <h1 className="text-2xl font-black">Hisobotlar</h1>
//           </div>

//           {/* FILTER BUTTONS */}
//           <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
//             {filters.map((f) => (
//               <button
//                 key={f.id}
//                 onClick={() => setFilter(f.id)}
//                 className={`px-5 py-2 rounded-xl text-[10px] uppercase font-black transition ${
//                   filter === f.id
//                     ? "bg-white text-black shadow"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {f.label}
//               </button>
//             ))}
//           </div>

//           {/* REFRESH */}
//           <button
//             onClick={() => fetchData(filter)}
//             className="p-3 bg-slate-100 rounded-xl"
//           >
//             <RefreshCw className={loading ? "animate-spin" : ""} />
//           </button>
//         </div>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
//         )}

//         {/* STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-slate-900 text-white p-8 rounded-[3rem]">
//             <p>Umumiy Savdo</p>
//             <h2 className="text-3xl">{totalSales.toLocaleString()} UZS</h2>
//             <p className="text-xs mt-2">
//               Naqd: {cashSales.toLocaleString()} | Karta:{" "}
//               {cardSales.toLocaleString()} | Nasiya:{" "}
//               {debtSales.toLocaleString()}
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-[3rem]">
//             <p>Sof Foyda</p>
//             <h2 className="text-3xl text-green-600">
//               {totalProfit.toLocaleString()} UZS
//             </h2>
//           </div>

//           <div className="bg-white p-8 rounded-[3rem]">
//             <p>Undirilgan Qarzlar</p>
//             <h2 className="text-3xl text-blue-600">
//               {receivedDebts.toLocaleString()} UZS
//             </h2>
//           </div>
//         </div>

//         {/* SALES LIST */}
//         <div className="bg-white p-8 rounded-[3rem]">
//           <h2 className="font-black mb-4">Savdo Tarixi ({filter})</h2>

//           {sales.length === 0 ? (
//             <p>Ma'lumot yo'q</p>
//           ) : (
//             sales.map((s, i) => (
//               <div key={i} className="flex justify-between border-b py-3">
//                 <div>
//                   <p>{s.mijoz || "Noma'lum"}</p>
//                   <p className="text-xs text-gray-400">{s.tolovTuri}</p>
//                 </div>

//                 <div className="text-right">
//                   <p>{n(s.summa).toLocaleString()} UZS</p>

//                   <p className="text-xs text-green-500">
//                     +
//                     {n(
//                       s.mahsulotlar?.reduce((a, b) => a + n(b.foyda), 0),
//                     ).toLocaleString()}{" "}
//                     foyda
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

/////

import React, { useEffect, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("kun");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const n = (v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v) || 0;
    if (typeof v === "object") {
      return Number(v.summa || v.amount || v.value || v.total || 0);
    }
    return 0;
  };

  const fetchData = async (selectedFilter) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(
        `https://sifat-pmy2.onrender.com/api/hisobot?filter=${selectedFilter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Server error: " + res.status);
      const json = await res.json();
      console.log("HISOBOT DATA:", selectedFilter, json);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  // ===== API dan kelgan fieldlarni ishlatamiz =====
  const sales = Array.isArray(data?.savdoTarixi) ? data.savdoTarixi : [];
  const payments = Array.isArray(data?.undirilganQarzlarRoyxati)
    ? data.undirilganQarzlarRoyxati
    : [];

  const totalSales = n(data?.umumiySavdo?.summa);
  const cashSales = n(data?.umumiySavdo?.naqd);
  const cardSales = n(data?.umumiySavdo?.karta);
  const nasiyaSales = n(data?.umumiySavdo?.nasiya);
  const totalProfit = n(data?.sofFoyda?.summa);
  const receivedDebts = n(data?.undirilganQarzlarJami?.summa);

  const filters = [
    { id: "kun", label: "Kun" },
    { id: "hafta", label: "Hafta" },
    { id: "oy", label: "Oy" },
    { id: "yil", label: "Yil" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-bold italic">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-8 rounded-[3rem]">
          <div className="flex items-center gap-3">
            <BarChart3 />
            <h1 className="text-2xl font-black">Hisobotlar</h1>
          </div>

          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2 rounded-xl text-[10px] uppercase font-black transition ${
                  filter === f.id
                    ? "bg-white text-black shadow"
                    : "text-gray-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchData(filter)}
            className="p-3 bg-slate-100 rounded-xl"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 text-white p-8 rounded-[3rem]">
            <p>Umumiy Savdo</p>
            <h2 className="text-3xl">{totalSales.toLocaleString()} UZS</h2>
            <p className="text-xs mt-2">
              Naqd: {cashSales.toLocaleString()} | Karta:{" "}
              {cardSales.toLocaleString()} | Nasiya:{" "}
              {nasiyaSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[3rem]">
            <p>Sof Foyda</p>
            <h2 className="text-3xl text-green-600">
              {totalProfit.toLocaleString()} UZS
            </h2>
          </div>

          <div className="bg-white p-8 rounded-[3rem]">
            <p>Undirilgan Qarzlar</p>
            <h2 className="text-3xl text-blue-600">
              {receivedDebts.toLocaleString()} UZS
            </h2>
          </div>
        </div>

        {/* SAVDO TARIXI */}
        <div className="bg-white p-8 rounded-[3rem]">
          <h2 className="font-black mb-4">Savdo Tarixi ({filter})</h2>

          {loading ? (
            <p className="text-gray-400">Yuklanmoqda...</p>
          ) : sales.length === 0 ? (
            <p className="text-gray-400">Ma'lumot yo'q</p>
          ) : (
            sales.map((s, i) => (
              <div
                key={s.id || i}
                className="flex justify-between border-b py-3"
              >
                <div>
                  <p>{s.mijoz || "Noma'lum"}</p>
                  <p className="text-xs text-gray-400">{s.tolovTuri}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(s.sana).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <div className="text-right">
                  <p>{n(s.summa).toLocaleString()} UZS</p>
                  <p className="text-xs text-green-500">
                    +
                    {n(
                      s.mahsulotlar?.reduce((a, b) => a + n(b.foyda), 0),
                    ).toLocaleString()}{" "}
                    foyda
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* UNDIRILGAN QARZLAR RO'YXATI */}
        {payments.length > 0 && (
          <div className="bg-white p-8 rounded-[3rem]">
            <h2 className="font-black mb-4">
              Undirilgan Qarzlar Ro'yxati ({filter})
            </h2>
            {payments.map((p, i) => (
              <div
                key={p.id || i}
                className="flex justify-between border-b py-3"
              >
                <div>
                  <p>{p.mijoz || "Noma'lum"}</p>
                  {p.telefon && (
                    <p className="text-xs text-gray-400">{p.telefon}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(p.sana).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600">
                    +{n(p.summa).toLocaleString()} UZS
                  </p>
                  {p.izoh && <p className="text-xs text-gray-400">{p.izoh}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

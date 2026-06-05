import React, { useEffect, useState } from "react";
import { apiService } from "../../api/api";
import {
  History,
  Search,
  Loader2,
  ArrowDownCircle,
  Package,
  Calendar,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";

// ═══════════════════════════════════
// HELPERS
// ═══════════════════════════════════

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PERIODS = [
  { label: "Bugun", value: "bugun" },
  { label: "Bu hafta", value: "hafta" },
  { label: "Bu oy", value: "oy" },
  { label: "Barchasi", value: "barchasi" },
];

// ═══════════════════════════════════
// STAT CARD
// ═══════════════════════════════════

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════

export default function StockHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("barchasi");
  const [showFilter, setShowFilter] = useState(false);

  // ── LOAD ──────────────────────────

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiService.getWarehouseHistory();
      setHistory(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("HISTORY ERROR:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ── FILTER ────────────────────────

  const now = new Date();

  const filtered = history.filter((item) => {
    // search
    const name = (
      item.productName ||
      item.name ||
      item.product?.name ||
      ""
    ).toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;

    // period
    if (period !== "barchasi") {
      const d = new Date(item.createdAt || item.date || item.timestamp);
      if (isNaN(d)) return true;

      if (period === "bugun") {
        return d.toDateString() === now.toDateString();
      }
      if (period === "hafta") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      if (period === "oy") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }
    }
    return true;
  });

  // ── STATS ─────────────────────────

  const totalKg = filtered.reduce(
    (s, i) => s + Number(i.quantityKg || i.weight || i.quantity || 0),
    0,
  );
  const totalValue = filtered.reduce(
    (s, i) =>
      s +
      Number(i.quantityKg || i.weight || i.quantity || 0) *
        Number(i.price || i.tannarx || i.cost || 0),
    0,
  );

  // ── RENDER ────────────────────────

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 font-bold italic">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── HEADER ── */}
        <div className="bg-white rounded-[2.5rem] px-8 py-6 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <History size={22} className="text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Kirim Tarixi
                </h1>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-0.5">
                  {filtered.length} ta yozuv
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-emerald-400 w-52 transition-all"
                />
              </div>

              {/* PERIOD FILTER */}
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs uppercase tracking-wider font-black"
                >
                  <Filter size={14} />
                  {PERIODS.find((p) => p.value === period)?.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showFilter ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilter && (
                  <div className="absolute right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-10 overflow-hidden w-36">
                    {PERIODS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => {
                          setPeriod(p.value);
                          setShowFilter(false);
                        }}
                        className={`w-full px-5 py-3 text-left text-xs font-black uppercase transition-colors ${
                          period === p.value
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Package size={20} />}
            label="Jami kirimlar"
            value={filtered.length}
            accent="#10b981"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Jami kg"
            value={`${totalKg.toFixed(1)} KG`}
            accent="#3b82f6"
          />
          <StatCard
            icon={<ArrowDownCircle size={20} />}
            label="Jami qiymat"
            value={`${totalValue.toLocaleString()} UZS`}
            accent="#f59e0b"
          />
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={36} className="animate-spin text-emerald-500" />
                <p className="text-slate-400 text-sm uppercase tracking-widest">
                  Yuklanmoqda...
                </p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <History size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-300 text-sm uppercase tracking-widest font-black">
                Yozuvlar topilmadi
              </p>
            </div>
          ) : (
            <>
              {/* desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                      <th className="px-8 py-5">#</th>
                      <th className="px-8 py-5">Mahsulot</th>
                      <th className="px-8 py-5 text-center">Miqdor</th>
                      <th className="px-8 py-5 text-center">Narxi</th>
                      <th className="px-8 py-5 text-center">Qiymat</th>
                      <th className="px-8 py-5 text-right">Sana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((item, idx) => {
                      const qty = Number(
                        item.quantityKg || item.weight || item.quantity || 0,
                      );
                      const price = Number(
                        item.price || item.tannarx || item.cost || 0,
                      );
                      const value = qty * price;
                      const name =
                        item.productName ||
                        item.name ||
                        item.product?.name ||
                        "Nomsiz mahsulot";
                      const dateStr =
                        item.createdAt || item.date || item.timestamp;

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <span className="text-xs text-slate-300 font-black">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <Package
                                  size={15}
                                  className="text-emerald-500"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-800 leading-tight">
                                  {name}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase mt-0.5">
                                  {item.category ||
                                    item.product?.category ||
                                    "Go'sht"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-5 text-center">
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-xl px-3 py-1.5 text-sm font-black">
                              {qty.toFixed(1)}
                              <span className="text-[10px]">KG</span>
                            </span>
                          </td>

                          <td className="px-8 py-5 text-center">
                            <span className="text-sm font-black text-slate-700">
                              {price > 0 ? (
                                `${price.toLocaleString()} UZS`
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </span>
                          </td>

                          <td className="px-8 py-5 text-center">
                            <span className="text-sm font-black text-emerald-600">
                              {value > 0 ? (
                                `${value.toLocaleString()} UZS`
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </span>
                          </td>

                          <td className="px-8 py-5 text-right">
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                <Calendar
                                  size={11}
                                  className="text-slate-300"
                                />
                                {formatDate(dateStr)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatTime(dateStr)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* FOOTER */}
                  <tfoot className="bg-slate-900">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-8 py-5 text-white font-black uppercase text-xs tracking-widest"
                      >
                        Jami
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-blue-300 font-black text-sm">
                          {totalKg.toFixed(1)} KG
                        </span>
                      </td>
                      <td className="px-8 py-5" />
                      <td className="px-8 py-5 text-center">
                        <span className="text-emerald-400 font-black text-sm">
                          {totalValue.toLocaleString()} UZS
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-400 text-xs font-black">
                        {filtered.length} ta yozuv
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* mobile cards */}
              <div className="md:hidden divide-y divide-slate-50">
                {filtered.map((item, idx) => {
                  const qty = Number(
                    item.quantityKg || item.weight || item.quantity || 0,
                  );
                  const price = Number(
                    item.price || item.tannarx || item.cost || 0,
                  );
                  const value = qty * price;
                  const name =
                    item.productName ||
                    item.name ||
                    item.product?.name ||
                    "Nomsiz mahsulot";
                  const dateStr = item.createdAt || item.date || item.timestamp;

                  return (
                    <div key={item.id || idx} className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Package size={16} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">
                              {name}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                              <Calendar size={10} />
                              {formatDate(dateStr)} · {formatTime(dateStr)}
                            </p>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-600 rounded-xl px-3 py-1.5 text-xs font-black">
                          {qty.toFixed(1)} KG
                        </span>
                      </div>
                      {value > 0 && (
                        <div className="mt-3 pl-13 ml-13">
                          <span className="text-xs text-emerald-600 font-black">
                            {value.toLocaleString()} UZS
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="bg-slate-900 px-5 py-4 flex justify-between items-center">
                  <span className="text-white text-xs font-black uppercase tracking-wider">
                    Jami
                  </span>
                  <div className="text-right">
                    <p className="text-blue-300 text-xs font-black">
                      {totalKg.toFixed(1)} KG
                    </p>
                    {totalValue > 0 && (
                      <p className="text-emerald-400 text-xs font-black">
                        {totalValue.toLocaleString()} UZS
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

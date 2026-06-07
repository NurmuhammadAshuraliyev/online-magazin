import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Wallet,
  AlertCircle,
  Banknote,
  History,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { apiService } from "../api/api";

// ── SAFE NUMBER ─────────────────────
const n = (v) => {
  if (!v && v !== 0) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  if (typeof v === "object")
    return Number(v.summa || v.amount || v.value || v.total || 0);
  return 0;
};

// ── STAT CARD ───────────────────────
function Card({ icon, label, value, sub, accent = "#10b981", dark = false }) {
  return (
    <div
      className={`p-8 rounded-[3rem] border shadow-sm hover:shadow-md transition-all ${
        dark
          ? "bg-slate-900 text-white border-slate-800"
          : "bg-white border-slate-100 text-slate-900"
      }`}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: dark ? `${accent}30` : `${accent}18`,
          color: accent,
        }}
      >
        {icon}
      </div>
      <p
        className={`text-[10px] uppercase mb-1 font-black tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}
      >
        {label}
      </p>
      <h2
        className={`text-2xl font-black ${dark ? "text-emerald-400" : ""}`}
        style={
          !dark ? { color: accent === "#10b981" ? undefined : accent } : {}
        }
      >
        {value}
      </h2>
      {sub && (
        <p
          className={`text-[9px] mt-2 uppercase ${dark ? "text-slate-500" : "text-slate-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── PERIODS ─────────────────────────
const PERIODS = [
  { id: "bugun", label: "Bugun" },
  { id: "hafta", label: "Hafta" },
  { id: "oy", label: "Oy" },
  { id: "yil", label: "Yil" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("bugun");
  const [error, setError] = useState(null);

  // ── FETCH ─────────────────────────
  const fetchStats = async (selectedFilter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getDashboardStats(selectedFilter);
      console.log("DASHBOARD API:", res);
      setStats(res);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
      setError("Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(filter);
  }, [filter]);

  // ── PARSE DATA ────────────────────
  // Swagger: /api/dashboard/statistika/period
  // Possible response fields (backend may vary):
  const totalSales = n(
    stats?.totalSales || stats?.jami_savdo || stats?.umumiySavdo,
  );
  const totalProfit = n(
    stats?.totalProfit || stats?.jami_foyda || stats?.umumiyFoyda,
  );
  const activeDebts = n(
    stats?.activeDebts ||
      stats?.faolQarzlar ||
      stats?.qolganNasiya ||
      stats?.remainingDebt,
  );
  const receivedDebts = n(
    stats?.receivedDebtPayments || stats?.undirilganQarz || stats?.olinganQarz,
  );
  const realSalesIncome = n(
    stats?.realSalesIncome || stats?.naqdKartaSavdo || stats?.realKelganPul,
  );
  const netCashFlow = n(
    stats?.netCashFlow || stats?.realKelganPul || realSalesIncome,
  );
  const totalExpected = n(
    stats?.totalExpectedMoney ||
      stats?.kutilayotganPul ||
      netCashFlow + activeDebts,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 italic font-bold">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── HEADER ── */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase italic text-slate-900">
              Statistika
            </h1>
           
          </div>

          <div className="flex items-center gap-3">
            {/* PERIOD FILTER */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilter(p.id)}
                  className={`px-5 py-2 rounded-xl text-[10px] uppercase font-black transition-all ${
                    filter === p.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* REFRESH */}
            <button
              onClick={() => fetchStats(filter)}
              disabled={loading}
              className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl text-sm font-black uppercase">
            {error}
          </div>
        )}

        {/* ── CARDS ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 — Real kelgan pul (highlight) */}
            <div className="bg-emerald-500 p-8 rounded-[3rem] shadow-xl text-white">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Banknote size={24} />
              </div>
              <p className="text-[10px] uppercase text-emerald-100 mb-1 font-black tracking-widest">
                Jami bolgan savdo 
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                {netCashFlow.toLocaleString()}{" "}
                <span className="text-sm font-medium opacity-70">UZS</span>
              </h2>
              
            </div>

            {/* 6 — Umumiy foyda (dark) */}
            <Card
              icon={<Wallet size={22} />}
              label="Umumiy Foyda"
              value={`${totalProfit.toLocaleString()} UZS`}
              sub="Naqd + karta + nasiya foydasi"
              accent="#10b981"
              dark
            />
          </div>
        )}

       
      </div>
    </div>
  );
}
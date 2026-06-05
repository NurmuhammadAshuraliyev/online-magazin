////////////////

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
// ─── API HELPER (tashqi import kerak emas) ────────────────────
const BASE = import.meta.env.VITE_BASE_URL || "";
const authFetch = async (method, path, body) => {
  const token = localStorage.getItem("user_token");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    localStorage.removeItem("user_token");
    window.location.href = "/login";
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};
const api = {
  get: (path) => authFetch("GET", path),
  post: (path, body) => authFetch("POST", path, body),
  delete: (path) => authFetch("DELETE", path),
};

// ─── TOAST ────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div
    style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
      background: type === "error" ? "#991b1b" : "#065f46",
      color: "#fff",
      borderRadius: 14,
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      fontSize: 14,
      fontWeight: 600,
      animation: "slideUp 0.3s ease",
    }}
  >
    {type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
    {msg}
    <button
      onClick={onClose}
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        marginLeft: 8,
      }}
    >
      <X size={16} />
    </button>
  </div>
);

// ─── PERIOD FILTER OPTIONS ─────────────────────────────────────
const PERIODS = [
  { value: "bugun", label: "Bugun" },
  { value: "hafta", label: "Hafta" },
  { value: "oy", label: "Oy" },
  { value: "yil", label: "Yil" },
];

const CashFlowPage = () => {
  // ── STATE ──
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("bugun");

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── LOAD DATA ──────────────────────────────────────────────
  const loadKassa = useCallback(async () => {
    setLoading(true);
    try {
      // 1) Kassa — backend: { tarixiyHarakatlar:[], umumiyQoldiq, jamiKirim, jamiChiqim }
      const kassaRes = await api.get(
        `/kassa?filter=${filter}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      );
      console.log("KASSA RES:", kassaRes);

      const kData = kassaRes?.data ?? kassaRes;
      const txList = kData?.tarixiyHarakatlar ?? kData?.transactions ?? [];
      setTransactions(Array.isArray(txList) ? txList : []);

      // 2) Statistika — /kassa/statistika
      const statRes = await api.get(`/kassa/statistika?filter=${filter}`);
      console.log("STAT RES:", statRes);
      const s = statRes?.data ?? statRes;

      setStats({
        balance: Number(
          kData?.umumiyQoldiq ??
            kData?.balance ??
            s?.umumiyQoldiq ??
            s?.balance ??
            0,
        ),
        totalIncome: Number(
          kData?.jamiKirim ??
            kData?.totalIncome ??
            s?.jamiKirim ??
            s?.totalIncome ??
            0,
        ),
        totalExpense: Number(
          kData?.jamiChiqim ??
            kData?.totalExpense ??
            s?.jamiChiqim ??
            s?.totalExpense ??
            0,
        ),
      });
    } catch (err) {
      console.error("KASSA LOAD ERROR:", err);
      notify("Ma'lumotlarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    loadKassa();
  }, [loadKassa]);

  // search input debounce
  useEffect(() => {
    const t = setTimeout(() => loadKassa(), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ── ADD TRANSACTION ────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      notify("Summa va izoh kiritish shart!", "error");
      return;
    }
    setSubmitting(true);
    try {
      // Backend qabul qiladigan body — swagger'dan ko'ra: type, summa/amount, izoh/description
      await api.post("/kassa", {
        type, // "income" | "expense"
        summa: Number(amount), // yoki amount — ikkalasini yuborish
        amount: Number(amount),
        izoh: description,
        description,
      });
      notify(
        type === "income"
          ? "Kirim muvaffaqiyatli qo'shildi!"
          : "Chiqim muvaffaqiyatli qo'shildi!",
      );
      setAmount("");
      setDescription("");
      loadKassa();
    } catch (err) {
      console.error("KASSA ADD ERROR:", err);
      notify("Qo'shishda xatolik yuz berdi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────
  const deleteItem = async (id) => {
    if (!window.confirm("Ushbu amalni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/kassa/${id}`);
      notify("O'chirildi!");
      loadKassa();
    } catch {
      notify("O'chirishda xatolik", "error");
    }
  };

  // ── EXCEL EXPORT ──────────────────────────────────────────
  const handleExcel = async () => {
    try {
      const res = await api.get(`/kassa/export?filter=${filter}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kassa_${filter}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      notify("Excel yuklab olishda xatolik", "error");
    }
  };

  // ── FILTERED TRANSACTIONS ──────────────────────────────────
  // search backend'da ishlayapti, lekin local filter ham qo'shamiz (backup)
  const filtered = transactions.filter((t) => {
    const desc = t.izoh || t.description || "";
    return desc.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <style>{`
        @keyframes slideUp { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes spin { to { transform:rotate(360deg) } }
      `}</style>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Kassa <span className="text-blue-600">Nazorati</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Barcha kirim va chiqimlarni real vaqtda boshqaring
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period filter */}
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setFilter(p.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border ${
                filter === p.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-200"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar size={14} /> {p.label}
            </button>
          ))}
          <button
            onClick={handleExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={16} /> Excel
          </button>
          <button
            onClick={loadKassa}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw
              size={14}
              style={loading ? { animation: "spin 1s linear infinite" } : {}}
            />
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[35px] text-white shadow-2xl shadow-slate-200 group transition-transform hover:scale-[1.01]">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <Wallet size={24} className="text-blue-400" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[3px] text-slate-400">
              Umumiy qoldiq
            </p>
            {loading ? (
              <div className="h-10 w-32 bg-white/10 rounded-xl mt-2 animate-pulse" />
            ) : (
              <h3 className="text-4xl font-black mt-2 tracking-tighter tabular-nums">
                {stats.balance.toLocaleString()}{" "}
                <span className="text-lg font-medium opacity-50 font-sans tracking-normal">
                  UZS
                </span>
              </h3>
            )}
          </div>
        </div>

        {/* Income */}
        <div className="bg-white p-8 rounded-[35px] border border-slate-50 shadow-xl shadow-slate-200/40 flex items-center gap-6 group transition-all hover:border-emerald-100">
          <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <ArrowUpRight size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
              Jami Kirim
            </p>
            {loading ? (
              <div className="h-7 w-28 bg-slate-100 rounded-lg mt-1 animate-pulse" />
            ) : (
              <h4 className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                +{stats.totalIncome.toLocaleString()}
              </h4>
            )}
          </div>
        </div>

        {/* Expense */}
        <div className="bg-white p-8 rounded-[35px] border border-slate-50 shadow-xl shadow-slate-200/40 flex items-center gap-6 group transition-all hover:border-rose-100">
          <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <ArrowDownLeft size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
              Jami Chiqim
            </p>
            {loading ? (
              <div className="h-7 w-28 bg-slate-100 rounded-lg mt-1 animate-pulse" />
            ) : (
              <h4 className="text-2xl font-black text-rose-500 mt-1 tabular-nums">
                -{stats.totalExpense.toLocaleString()}
              </h4>
            )}
          </div>
        </div>
      </div>

      {/* ── INPUT FORM ── */}
      <div className="bg-white/60 backdrop-blur-md p-2 rounded-[40px] border border-white shadow-sm">
        <div className="bg-white p-6 lg:p-8 rounded-[35px] shadow-inner border border-slate-50">
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block">
                Amal turi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 font-bold text-sm outline-none transition-all appearance-none"
              >
                <option value="income">💰 Kirim (Kirim qilish)</option>
                <option value="expense">💸 Chiqim (Harajat)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block">
                Summa (UZS)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 font-bold text-sm outline-none transition-all"
              />
            </div>

            <div className="md:col-span-4">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block">
                Batafsil izoh
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nima uchun? (masalan: Go'sht sotuvi)"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 font-bold text-sm outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white p-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? (
                  <RefreshCw
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Plus size={20} strokeWidth={3} />
                )}
                QO'SHISH
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── TRANSACTIONS TABLE ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2">
            <Filter size={20} className="text-blue-600" /> Tarixiy harakatlar
          </h3>
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Tranzaksiyalardan qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] bg-slate-50/50">
                  <th className="px-10 py-6">Vaqt va Sana</th>
                  <th className="px-10 py-6">Izoh</th>
                  <th className="px-10 py-6 text-center">Turi</th>
                  <th className="px-10 py-6 text-right">Miqdor</th>
                  <th className="px-10 py-6 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-10 py-6">
                          <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Wallet size={32} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">
                          Hozircha hech qanday ma'lumot yo'q
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    // backend: tarixiyHarakatlar[i] = { id, type, summa, izoh, createdAt }
                    const txType = (t.type || t.turi || "").toUpperCase();
                    const txAmount = Number(
                      t.summa || t.amount || t.miqdor || 0,
                    );
                    const txDesc = t.izoh || t.description || t.nomi || "—";
                    const rawDate = t.createdAt || t.sana || t.date;
                    const txDate = rawDate
                      ? new Date(rawDate).toLocaleString("uz-UZ", {
                          hour12: false,
                        })
                      : "—";
                    const isExpense =
                      txType === "CHIQIM" || txType === "EXPENSE";

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-10 py-6">
                          <div className="text-[11px] font-bold text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                            {txDate}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-sm font-black text-slate-700 uppercase italic tracking-wide">
                            {txDesc}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                              !isExpense
                                ? "bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100"
                                : "bg-rose-100 text-rose-600 shadow-sm shadow-rose-100"
                            }`}
                          >
                            {!isExpense ? "Kirim" : "Chiqim"}
                          </span>
                        </td>
                        <td
                          className={`px-10 py-6 text-right font-black text-lg tabular-nums ${
                            !isExpense ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {!isExpense ? "+" : "-"}
                          {txAmount.toLocaleString()}
                        </td>
                        <td className="px-10 py-6 text-center">
                          <button
                            onClick={() => deleteItem(t.id)}
                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowPage;

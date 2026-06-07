import React, { useState, useEffect } from "react";
import { apiService } from "../api/api";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  Plus,
  Loader2,
  Wallet,
  CreditCard,
  UserCheck,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("list");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputWeight, setInputWeight] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("NAQD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // ── LOAD PRODUCTS ─────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiService.getProducts();
      const data = Array.isArray(res) ? res : [];
      setProducts(data);
    } catch (err) {
      toast.error("Ma'lumot yuklashda xato!");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = (receipt) => {
    const COMPANY_NAME = "SIFAT BROYLER 066";
    const ADDRESS = "Yozyovon tumani";
    const PHONES = "+998 94 806 00 66, +998 90 301 17 11";
  
    const fmt = (num) =>
      new Intl.NumberFormat("uz-UZ").format(Math.round(Number(num || 0)));
  
    const payM = String(receipt.paymentMethod || "NAQD").toUpperCase();
  
    const oldDebt = Number(receipt.oldDebt || 0);
    const newDebt = payM === "NASIYA" ? Number(receipt.total || 0) : 0;
  
    const totalDebt =
      payM === "NASIYA"
        ? oldDebt + newDebt
        : Number(receipt.totalDebt || oldDebt || 0);
  
    const hasDebt = oldDebt > 0 || totalDebt > 0;

    const html = `<html><head><style>
      @page{size:80mm auto;margin:0}
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;width:72mm;margin:0 auto;padding:4mm 5mm 65mm;font-size:12px;font-weight:900;text-transform:uppercase;color:#000;line-height:1.25;overflow-wrap:break-word}
      .center{text-align:center}
      .brand{font-size:18px;font-weight:900;border-bottom:3px solid #000;margin-bottom:5px;padding-bottom:5px}
      .info{font-size:11px;line-height:1.35}
      .line{border-top:3px solid #000;margin:8px 0}
      .sale-info{font-size:12px;line-height:1.45}
      table{width:100%;border-collapse:collapse;table-layout:fixed}
      th{text-align:left;border-bottom:2px solid #000;padding-bottom:5px;font-size:10px}
      td{padding:6px 0;font-size:11px;font-weight:900;vertical-align:top;word-break:break-word}
      .name-col{width:34%}.kg-col{width:14%;text-align:center}.price-col{width:24%;text-align:right}.sum-col{width:28%;text-align:right}
      .total-section{margin-top:10px;border-top:3px solid #000;padding-top:10px}
      .total-row{display:flex;justify-content:space-between;gap:8px;font-size:16px;font-weight:900}
      .debt-box{margin-top:12px;padding:8px;border:3px solid #000;font-size:12px;line-height:1.5}
      .debt-row{display:flex;justify-content:space-between;gap:8px}
      .debt-row span:last-child{text-align:right}
      .debt-total{margin-top:6px;padding-top:6px;border-top:2px dashed #000;font-size:15px}
      .footer{text-align:center;margin-top:25px;border-top:1px dashed #000;padding-top:10px;font-size:11px;line-height:1.4}
    </style></head><body>
      <div class="center">
        <div class="brand">${COMPANY_NAME}</div>
        <div class="info">${ADDRESS}</div>
        <div class="info">TEL: ${PHONES}</div>
      </div>
      <div class="line"></div>
      <div class="sale-info">
        ID: #${receipt.id || "---"}<br/>
        SANA: ${new Date().toLocaleString("uz-UZ")}<br/>
        MIJOZ: ${receipt.customerName || "NAQD MIJOZ"}<br/>
        TEL: ${receipt.customerPhone || "---"}<br/>
        TO'LOV: ${payM}
      </div>
      <div class="line"></div>
      <table>
        <thead><tr>
          <th class="name-col">NOMI</th>
          <th class="kg-col">KG</th>
          <th class="price-col">NARX</th>
          <th class="sum-col">SUMMA</th>
        </tr></thead>
        <tbody>
          ${(receipt.items || [])
            .map((i) => {
              const qty = Number(i.qty || i.quantityKg || 0);
              const price = Number(i.price || i.sotish || 0);
              return `<tr>
              <td class="name-col">${i.name || ""}</td>
              <td class="kg-col">${qty.toFixed(2)}</td>
              <td class="price-col">${fmt(price)}</td>
              <td class="sum-col">${fmt(qty * price)}</td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
      <div class="total-section">
        <div class="total-row"><span>JAMI:</span><span>${fmt(receipt.total)} UZS</span></div>
        ${
          hasDebt
            ? `<div class="debt-box">
          <div class="debt-row"><span>OLDINGI QARZ:</span><span>${fmt(oldDebt)} UZS</span></div>
          ${
            payM === "NASIYA"
              ? `
            <div class="debt-row"><span>YANGI QARZ:</span><span>${fmt(newDebt)} UZS</span></div>
            <div class="debt-row debt-total"><span>UMUMIY QARZ:</span><span>${fmt(totalDebt)} UZS</span></div>
          `
              : `<div class="debt-row debt-total"><span>HOZIRGI QARZ:</span><span>${fmt(totalDebt)} UZS</span></div>`
          }
        </div>`
            : ""
        }
      </div>
      <div class="footer">XARIDINGIZ UCHUN RAHMAT!<br/>YANA KELIB TURING!</div>
      <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}</script>
    </body></html>`;

    const w = window.open("", "_blank", "width=450,height=700");
    if (w) {
      w.document.write(html);
      w.document.close();
    } else alert("Brauzerda oyna ochishga ruxsat bering");
  };

  // ── COMPLETE SALE ─────────────────
  const handleCompleteSale = async () => {
    if (!cart || cart.length === 0)
      return toast.error("Savat bo'sh!");
  
    if (paymentMethod === "NASIYA") {
      if (!customerName.trim())
        return toast.error("Mijoz ismini kiriting!");
      if (!customerPhone.trim())
        return toast.error("Telefon raqam kiriting!");
    }
  
    try {
      setIsSubmitting(true);
  
      const totalAmount = cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.qty || 0),
        0
      );
  
      // =========================
      // 🔥 1. OLD DEBT FETCH (API)
      // =========================
      let oldDebt = 0;
  
      try {
        if (paymentMethod === "NASIYA") {
          const res = await apiService.getCustomerDebt({
            name: customerName,
            phone: customerPhone,
          });
  
          oldDebt = res?.remainingDebt || res?.totalDebt || 0;
        }
      } catch (err) {
        console.log("Debt API error:", err);
  
        // fallback (localStorage)
        const debts = JSON.parse(localStorage.getItem("debts") || "[]");
  
        const found = debts.find((d) => {
          const nameMatch =
            (d.customerName || "").toLowerCase() ===
            customerName.toLowerCase();
  
          return nameMatch;
        });
  
        oldDebt = found?.remainingDebt || found?.totalDebt || 0;
      }
  
      // =========================
      // 🔥 2. CREATE SALE API
      // =========================
      const salePayload = {
        items: cart.map((item) => ({
          productId: item.id || item.productId,
          quantityKg: Number(item.qty || 0),
          price: Number(item.price || 0),
        })),
        paymentMethod,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
      };
  
      let saleId = Date.now();
  
      try {
        const res = await apiService.createSale(salePayload);
        saleId = res?.id || res?.saleId || saleId;
      } catch (err) {
        console.log("Sale API error:", err);
      }
  
      // =========================
      // 🔥 3. UPDATE LOCAL DEBT (NASIYA)
      // =========================
      if (paymentMethod === "NASIYA") {
        const debts = JSON.parse(localStorage.getItem("debts") || "[]");
  
        const name = customerName.trim().toLowerCase();
  
        const existIdx = debts.findIndex(
          (d) =>
            (d.customerName || "").trim().toLowerCase() === name
        );
  
        if (existIdx >= 0) {
          debts[existIdx].totalDebt =
            Number(debts[existIdx].totalDebt || 0) + totalAmount;
  
          debts[existIdx].remainingDebt =
            Number(debts[existIdx].remainingDebt || 0) + totalAmount;
  
          debts[existIdx].lastUpdate = new Date().toLocaleString();
        } else {
          debts.push({
            id: saleId,
            customerName,
            phone: customerPhone,
            totalDebt: totalAmount,
            remainingDebt: totalAmount,
            paidAmount: 0,
            date: new Date().toISOString(),
            items: [...cart],
          });
        }
  
        localStorage.setItem("debts", JSON.stringify(debts));
      }
  
      // =========================
      // 🔥 4. PRINT RECEIPT (FIXED)
      // =========================
      printReceipt({
        id: saleId,
        customerName: customerName || "Naqd mijoz",
        customerPhone,
        items: cart,
        total: totalAmount,
        paymentMethod,
  
        // ⭐⭐⭐ ENG MUHIM QATOR
        oldDebt,
      });
  
      // =========================
      // RESET STATE
      // =========================
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setPaymentMethod("NAQD");
      setView("list");
  
      toast.success("Sotuv yakunlandi!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 italic font-bold">
      <div className="max-w-5xl mx-auto">
        {/* ── VIEW 1: MAHSULOTLAR ── */}
        {view === "list" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center gap-4">
              <h1 className="text-xl font-black uppercase flex items-center gap-2 text-slate-800">
                <ShoppingCart className="text-emerald-500" /> Mahsulotlar
              </h1>
              <input
                type="text"
                placeholder="Qidirish..."
                className="bg-slate-50 p-3 px-6 rounded-2xl outline-none border-none w-full max-w-xs"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <Loader2
                  className="animate-spin mx-auto text-emerald-500 col-span-3"
                  size={40}
                />
              ) : (
                products
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <h3 className="font-black uppercase text-xs mb-2">
                        {p.name}
                      </h3>
                      <p className="text-emerald-600 font-black text-lg mb-4">
                        {Number(p.sotish || p.price || 0).toLocaleString()} UZS
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 uppercase italic">
                          {Number(p.stockKg || p.currentStock || 0).toFixed(1)}{" "}
                          kg bor
                        </span>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          disabled={
                            Number(p.stockKg || p.currentStock || 0) <= 0
                          }
                          className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-20"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* SAVAT PANEL */}
            {cart.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-6 rounded-[3rem] shadow-2xl border border-emerald-100 flex justify-between items-center z-40">
                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Jami Savatda:
                  </p>
                  <p className="text-xl font-black text-emerald-600">
                    {totalAmount.toLocaleString()} UZS
                  </p>
                </div>
                <button
                  onClick={() => setView("checkout")}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl uppercase text-[10px] font-black tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                  To'lovga o'tish <CheckCircle2 size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── VIEW 2: CHECKOUT ── */}
        {view === "checkout" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] mb-4"
            >
              <ChevronLeft size={16} /> Mahsulotlarga qaytish
            </button>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
              <h2 className="text-2xl font-black uppercase italic text-center border-b pb-4">
                To'lov Tafsilotlari
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Mijoz ismi (ixtiyoriy)"
                  className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-black text-lg focus:ring-2 ring-emerald-500 transition-all"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "NAQD", name: "Naqd", icon: <Wallet size={18} /> },
                    {
                      id: "KARTA",
                      name: "Karta",
                      icon: <CreditCard size={18} />,
                    },
                    {
                      id: "NASIYA",
                      name: "Nasiya",
                      icon: <UserCheck size={18} />,
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-4 transition-all ${
                        paymentMethod === m.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                          : "border-slate-50 text-slate-300"
                      }`}
                    >
                      {m.icon}
                      <span className="text-[10px] font-black uppercase">
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "NASIYA" && (
                  <input
                    type="text"
                    placeholder="Telefon raqami (+998...)"
                    className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-black text-lg"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                )}
              </div>

              {/* CART SUMMARY */}
              <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100">
                {cart.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-5 py-3"
                  >
                    <div>
                      <p className="text-xs font-black uppercase">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.qty} kg × {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-black text-emerald-600">
                      {(item.qty * item.price).toLocaleString()} UZS
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <div className="flex justify-between items-center mb-2 text-[10px] uppercase text-slate-400">
                  <span>Umumiy miqdor:</span>
                  <span>{cart.length} turdagi mahsulot</span>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {totalAmount.toLocaleString()} UZS
                </div>
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={isSubmitting}
                className="w-full bg-emerald-500 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Sotuv bajarilmoqda..."
                  : "Sotuvni yakunlash va chek chiqarish"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MIQDOR MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
            <h2 className="font-black uppercase italic text-center mb-6 text-slate-800">
              Kg kiriting
            </h2>
            <div className="bg-slate-50 p-4 rounded-2xl text-center mb-6">
              <p className="font-black text-emerald-600 italic uppercase text-xs">
                {selectedProduct.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Mavjud:{" "}
                {Number(
                  selectedProduct.stockKg || selectedProduct.currentStock || 0,
                ).toFixed(1)}{" "}
                kg
              </p>
            </div>
            <input
              autoFocus
              type="number"
              step="0.01"
              className="w-full bg-slate-50 rounded-[2rem] p-6 text-4xl font-black outline-none border-4 border-transparent focus:border-emerald-500 text-center mb-6"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="0.0"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setInputWeight("");
                }}
                className="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-[10px]"
              >
                Bekor
              </button>
              <button
                onClick={() => {
                  const w = parseFloat(inputWeight);
                  const stock = Number(
                    selectedProduct.stockKg ||
                      selectedProduct.currentStock ||
                      0,
                  );
                  if (w > 0 && w <= stock) {
                    const price = Number(
                      selectedProduct.sotish || selectedProduct.price || 0,
                    );
                    const cost = Number(
                      selectedProduct.tannarx || selectedProduct.cost || 0,
                    );
                    setCart([
                      ...cart,
                      {
                        ...selectedProduct,
                        price,
                        cost,
                        qty: w,
                      },
                    ]);
                    setSelectedProduct(null);
                    setInputWeight("");
                    toast.success("Savatga qo'shildi");
                  } else {
                    toast.error("Zaxira yetarli emas yoki noto'g'ri vazn!");
                  }
                }}
                className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px]"
              >
                Savatga qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

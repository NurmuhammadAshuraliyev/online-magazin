// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import {
//   Search,
//   Phone,
//   UserX,
//   CheckCircle,
//   X,
//   UserPlus,
//   Trash2,
//   Edit2,
//   Eye,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { apiService } from "../api/api";

// // ✅ Portal — modal ni body ga render qiladi, z-index / overflow muammo yo'q
// const Modal = ({ children, onClose, align = "center" }) => {
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", onKey);
//     };
//   }, []);
//   return ReactDOM.createPortal(
//     <div
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose?.();
//       }}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 99999,
//         background: "rgba(15,23,42,0.65)",
//         backdropFilter: "blur(6px)",
//         display: "flex",
//         alignItems: align === "top" ? "flex-start" : "center",
//         justifyContent: "center",
//         padding: align === "top" ? "40px 16px 16px" : "16px",
//         overflowY: "auto",
//       }}
//     >
//       {children}
//     </div>,
//     document.body,
//   );
// };

// const normalizeCustomer = (d = {}) => {
//   const name = d.ism || d.name || d.mijozIsmi || "Nomsiz";
//   const phone = d.telefon || d.phone || "N/A";
//   const totalDebt = Number(d.totalDebt || d.aslSumma || 0);
//   const remainingDebt = Number(d.qolganQarz ?? d.remainingDebt ?? totalDebt);
//   const paidAmount = Number(d.jamiTolangan || d.tolanganSumma || 0);
//   return {
//     id: String(d.id || d._id || Date.now()),
//     customerId: String(d.id || d._id || ""),
//     name,
//     customerName: name,
//     phone,
//     totalDebt,
//     paidAmount,
//     remainingDebt: Math.max(0, remainingDebt),
//     lastUpdate: d.yangilangan || d.updatedAt || d.createdAt || "",
//     status: d.status || "ACTIVE",
//     type: "api",
//     items: [],
//   };
// };

// const normalizeNasiya = (d = {}) => {
//   const mijoz = d.mijoz || d.customer || {};
//   const name =
//     mijoz.ism || mijoz.name || d.ism || d.name || d.mijozIsmi || "Nomsiz";
//   const phone = mijoz.telefon || mijoz.phone || d.telefon || d.phone || "N/A";
//   const totalDebt = Number(d.aslSumma || d.totalDebt || 0);
//   const paidAmount = Number(
//     d.jamiTolangan || d.tolanganSumma || d.paidAmount || 0,
//   );
//   const remainingDebt = Number(
//     d.qolganQarz ??
//       d.qolganSumma ??
//       d.remainingDebt ??
//       totalDebt - paidAmount ??
//       0,
//   );
//   return {
//     id: String(d.id || d._id || Date.now()),
//     customerId: String(mijoz.id || d.customerId || ""),
//     name,
//     customerName: name,
//     phone,
//     totalDebt,
//     paidAmount,
//     remainingDebt: Math.max(0, remainingDebt),
//     lastUpdate: d.yangilangan || d.updatedAt || d.createdAt || "",
//     status: d.status || "ACTIVE",
//     type: "api",
//     items: [],
//   };
// };

// // ✅ RAW javobdan nasiyalar arrayini olish
// const extractNasiyalar = (res) => {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   if (Array.isArray(res.nasiyalar)) return res.nasiyalar;
//   if (Array.isArray(res.mijozlar)) return res.mijozlar;
//   if (Array.isArray(res.data?.nasiyalar)) return res.data.nasiyalar;
//   if (Array.isArray(res.data)) return res.data;
//   return [];
// };

// // ✅ Customer uchun nasiya ID sini topish
// const findActiveNasiyaId = (nasiyalar, fallbackId) => {
//   if (!nasiyalar || nasiyalar.length === 0) return fallbackId;
//   const active = nasiyalar.find(
//     (n) => n.status === "ACTIVE" || Number(n.qolganQarz || 0) > 0,
//   );
//   return active?.id || nasiyalar[0]?.id || fallbackId;
// };

// export default function DebtsPage() {
//   const [debts, setDebts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newDebt, setNewDebt] = useState({
//     name: "",
//     phone: "",
//     amount: "",
//     note: "",
//   });
//   const [addLoading, setAddLoading] = useState(false);

//   const [selectedDebt, setSelectedDebt] = useState(null);
//   const [paymentAmount, setPaymentAmount] = useState("");
//   const [paymentNote, setPaymentNote] = useState("");
//   const [payLoading, setPayLoading] = useState(false);

//   const [editDebt, setEditDebt] = useState(null);
//   const [editNote, setEditNote] = useState("");
//   const [editLoading, setEditLoading] = useState(false);

//   const [detailDebt, setDetailDebt] = useState(null);
//   const [detailNasiyalar, setDetailNasiyalar] = useState([]);
//   const [detailLoading, setDetailLoading] = useState(false);

//   useEffect(() => {
//     loadDebts();
//   }, []);

//   // ===================== LOAD =====================
//   const loadDebts = async () => {
//     try {
//       setLoading(true);
//       let result = [];

//       // 1: GET /nasiya/customers
//       try {
//         const raw = await apiService.getNasiyaCustomers();
//         console.log("getNasiyaCustomers RAW:", raw);
//         const arr = extractNasiyalar(raw);
//         if (arr.length > 0) {
//           result = arr.map(normalizeCustomer);
//         }
//       } catch (err) {
//         console.warn("getNasiyaCustomers xatolik:", err?.message);
//       }

//       // 2: GET /nasiya fallback
//       if (result.length === 0) {
//         try {
//           const raw = await apiService.getDebts();
//           console.log("getDebts RAW:", raw);
//           const arr = extractNasiyalar(raw);
//           if (arr.length > 0) result = arr.map(normalizeNasiya);
//         } catch (err) {
//           console.warn("getDebts xatolik:", err?.message);
//         }
//       }

//       // 3: localStorage fallback
//       if (result.length === 0) {
//         const local = JSON.parse(localStorage.getItem("debts") || "[]");
//         if (local.length > 0) {
//           result = local;
//           console.warn("LocalStorage dan yüklandi");
//         }
//       }

//       setDebts(result);
//       if (result.length > 0)
//         localStorage.setItem("debts", JSON.stringify(result));
//     } catch (err) {
//       console.error("loadDebts ERROR:", err);
//       setDebts(JSON.parse(localStorage.getItem("debts") || "[]"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===================== DETAIL =====================
//   const handleViewDetail = async (debt) => {
//     setDetailDebt(debt);
//     setDetailNasiyalar([]);
//     setDetailLoading(true);
//     try {
//       // ✅ RAW javobni olamiz — toArray ishlatmaymiz
//       const res = await apiService.getCustomerDebtsRaw(
//         debt.customerId || debt.id,
//       );
//       console.log("getCustomerDebtsRaw:", res);
//       const arr = extractNasiyalar(res);
//       setDetailNasiyalar(arr);
//     } catch (err) {
//       console.warn("getCustomerDebts xatolik:", err?.message);
//       setDetailNasiyalar([]);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // ===================== ADD =====================
//   const handleAddNewDebt = async (e) => {
//     e.preventDefault();
//     const amount = Number(newDebt.amount);
//     if (!newDebt.name.trim()) return toast.error("Mijoz ismini kiriting!");
//     if (!amount || amount <= 0) return toast.error("Qarz miqdorini kiriting!");

//     setAddLoading(true);
//     try {
//       // POST /nasiya/mijoz — yangi mijoz + nasiya birga
//       const apiRes = await apiService.createDebtWithCustomer({
//         mijozIsmi: newDebt.name.trim(),
//         telefon: newDebt.phone.trim() || undefined,
//         aslSumma: amount,
//         izoh: newDebt.note.trim() || undefined,
//       });

//       console.log("createDebtWithCustomer natija:", apiRes);

//       // ✅ Har qanday javob (null ham emas) = muvaffaqiyat deb hisoblaymiz
//       // chunki apiService.createDebtWithCustomer throw qilmasa = server qabul qildi
//       toast.success("Qarz qo'shildi!");
//       setNewDebt({ name: "", phone: "", amount: "", note: "" });
//       setIsAddModalOpen(false);
//       setTimeout(() => loadDebts(), 1000);
//     } catch (err) {
//       console.error("ADD ERROR:", err);
//       if (err?.message?.includes("telefon raqam allaqachon")) {
//         try {
//           const raw = await apiService.getNasiyaCustomers(newDebt.phone.trim());
//           const arr = extractNasiyalar(raw);
//           const existing = arr[0];
//           const customerId = existing?.id;

//           if (customerId) {
//             await apiService.createDebt({
//               customerId,
//               aslSumma: amount,
//               izoh: newDebt.note.trim() || undefined,
//             });
//             toast.success("Mavjud mijozga qarz qo'shildi!");
//             setNewDebt({ name: "", phone: "", amount: "", note: "" });
//             setIsAddModalOpen(false);
//             setTimeout(() => loadDebts(), 800);
//             return;
//           } else {
//             toast.error("Mijoz topilmadi");
//           }
//         } catch (e) {
//           toast.error("Xatolik: " + (e?.message || ""));
//         }
//         setAddLoading(false);
//         return;
//       }
//       // Fallback: avval customer yaratib, keyin nasiya
//       try {
//         const customer = await apiService.createNasiyaCustomer({
//           name: newDebt.name.trim(),
//           telefon: newDebt.phone.trim() || undefined,
//         });
//         console.log("createNasiyaCustomer:", customer);
//         const customerId = customer?.id || customer?.data?.id || customer?._id;
//         if (customerId) {
//           await apiService.createDebt({
//             customerId: String(customerId),
//             aslSumma: amount,
//             izoh: newDebt.note.trim() || undefined,
//           });
//           toast.success("Qarz qo'shildi!");
//           setNewDebt({ name: "", phone: "", amount: "", note: "" });
//           setIsAddModalOpen(false);
//           setTimeout(() => loadDebts(), 1000);
//         } else {
//           toast.error("Mijoz ID topilmadi");
//         }
//       } catch (err2) {
//         console.error("FALLBACK ERROR:", err2);
//         toast.error("Qarz qo'shishda xatolik: " + (err2?.message || ""));
//       }
//     } finally {
//       setAddLoading(false);
//     }
//   };

//   // ===================== PAYMENT =====================
//   const handlePayment = async () => {
//     const amount = Number(paymentAmount);
//     if (!amount || amount <= 0)
//       return toast.error("To'lov summasini kiriting!");
//     const maxAmount = Number(
//       selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
//     );
//     if (amount > maxAmount)
//       return toast.error(`Maksimal: ${maxAmount.toLocaleString()} UZS`);

//     setPayLoading(true);
//     try {
//       // ✅ Nasiya ID sini topamiz
//       let nasiyaId = selectedDebt.id;

//       if (selectedDebt.customerId) {
//         try {
//           const res = await apiService.getCustomerDebtsRaw(
//             selectedDebt.customerId,
//           );
//           const arr = extractNasiyalar(res);
//           nasiyaId = findActiveNasiyaId(arr, nasiyaId);
//           console.log("To'lov uchun nasiyaId:", nasiyaId);
//         } catch (e) {
//           console.warn("nasiyaId topishda xato:", e?.message);
//         }
//       }

//       await apiService.payDebt(
//         nasiyaId,
//         amount,
//         paymentNote.trim() || undefined,
//       );
//       toast.success("To'lov qabul qilindi!");
//       setSelectedDebt(null);
//       setPaymentAmount("");
//       setPaymentNote("");
//       setTimeout(() => loadDebts(), 800);
//     } catch (err) {
//       console.warn("payDebt xatolik:", err?.message);
//       // Local update fallback
//       const updated = debts.map((d) => {
//         if (String(d.id) !== String(selectedDebt.id)) return d;
//         const newRemaining = Math.max(
//           0,
//           Number(d.remainingDebt || d.totalDebt || 0) - amount,
//         );
//         return {
//           ...d,
//           paidAmount: Number(d.paidAmount || 0) + amount,
//           remainingDebt: newRemaining,
//           status: newRemaining === 0 ? "CLOSED" : "ACTIVE",
//           lastUpdate: new Date().toLocaleString(),
//         };
//       });
//       setDebts(updated);
//       localStorage.setItem("debts", JSON.stringify(updated));
//       toast.success("To'lov saqlandi (local)");
//       setSelectedDebt(null);
//       setPaymentAmount("");
//       setPaymentNote("");
//     } finally {
//       setPayLoading(false);
//     }
//   };

//   // ===================== EDIT =====================
//   const handleEditSave = async () => {
//     if (!editDebt) return;
//     if (!editNote.trim()) return toast.error("Izoh kiriting!");

//     setEditLoading(true);
//     try {
//       // ✅ Nasiya ID sini topamiz
//       let nasiyaId = editDebt.id;

//       if (editDebt.customerId) {
//         try {
//           const res = await apiService.getCustomerDebtsRaw(editDebt.customerId);
//           const arr = extractNasiyalar(res);
//           nasiyaId = findActiveNasiyaId(arr, nasiyaId);
//           console.log("Edit uchun nasiyaId:", nasiyaId);
//         } catch (e) {
//           console.warn("nasiyaId topishda xato:", e?.message);
//         }
//       }

//       await apiService.updateDebt(nasiyaId, { izoh: editNote.trim() });
//       toast.success("Izoh yangilandi!");
//       setEditDebt(null);
//       setEditNote("");
//       setTimeout(() => loadDebts(), 800);
//     } catch (err) {
//       console.error("EDIT ERROR:", err);
//       toast.error("Tahrirlashda xatolik: " + (err?.message || "Server xatosi"));
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // ===================== DELETE =====================
//   const handleDelete = async (debt) => {
//     if (!window.confirm(`"${debt.name}" ni o'chirasizmi?`)) return;
//     try {
//       let deleted = false;
//       if (debt.customerId) {
//         try {
//           const res = await apiService.getCustomerDebtsRaw(debt.customerId);
//           const arr = extractNasiyalar(res);
//           for (const n of arr) {
//             await apiService.deleteDebt(n.id);
//           }
//           deleted = true;
//         } catch (e) {
//           console.warn("nasiyalarni o'chirishda xato:", e?.message);
//         }
//       }
//       if (!deleted) {
//         await apiService.deleteDebt(debt.id);
//       }
//       toast.success("O'chirildi!");
//       setTimeout(() => loadDebts(), 800);
//     } catch (err) {
//       toast.error("O'chirishda xatolik: " + (err?.message || ""));
//     }
//   };

//   const filteredDebts = debts.filter((d) => {
//     const hasDebt = Number(d.remainingDebt || d.totalDebt || 0) > 0;
//     const matchSearch = String(d.customerName || d.name || "")
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return hasDebt && matchSearch;
//   });

//   const totalDebt = filteredDebts.reduce(
//     (s, d) => s + Number(d.remainingDebt || d.totalDebt || 0),
//     0,
//   );

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-2xl font-black">
//         Yuklanmoqda...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 italic font-bold">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center">
//               <UserX size={28} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-black uppercase italic text-slate-900">
//                 Nasiyalar
//               </h1>
//               <p className="text-[10px] text-slate-400 uppercase">
//                 Jami qarz: {totalDebt.toLocaleString()} UZS ·{" "}
//                 {filteredDebts.length} ta mijoz
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
//             <div className="relative flex-1 md:w-64">
//               <Search
//                 className="absolute left-4 top-3 text-slate-300"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 placeholder="Qidirish..."
//                 className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-2xl outline-none"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
//             >
//               <UserPlus size={18} /> Yangi Qarz
//             </button>
//           </div>
//         </div>

//         {/* LIST */}
//         <div className="grid grid-cols-1 gap-4">
//           {filteredDebts.map((debt) => {
//             const name = debt.customerName || debt.name || "Nomsiz";
//             const amount = Number(debt.remainingDebt || debt.totalDebt || 0);
//             return (
//               <div
//                 key={debt.id}
//                 className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
//               >
//                 <div className="flex items-center gap-4 flex-1">
//                   <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black italic border">
//                     {String(name).charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <h3 className="font-black uppercase text-slate-800">
//                       {name}
//                     </h3>
//                     <p className="text-[10px] text-slate-400 flex items-center gap-2">
//                       <Phone size={10} />
//                       {debt.phone || "N/A"}
//                     </p>
//                     <p className="text-[9px] text-slate-300">
//                       {debt.lastUpdate || ""}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="text-right mr-2">
//                     <p className="text-[9px] uppercase text-slate-400">Qarz</p>
//                     <p className="text-lg font-black text-rose-600">
//                       {amount.toLocaleString()} UZS
//                     </p>
//                     {debt.paidAmount > 0 && (
//                       <p className="text-[9px] text-emerald-500">
//                         To'langan: {Number(debt.paidAmount).toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => handleViewDetail(debt)}
//                     className="bg-slate-50 text-slate-500 p-3 rounded-2xl"
//                     title="Tarix"
//                   >
//                     <Eye size={18} />
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditDebt(debt);
//                       setEditNote("");
//                     }}
//                     className="bg-blue-50 text-blue-500 p-3 rounded-2xl"
//                     title="Tahrirlash"
//                   >
//                     <Edit2 size={18} />
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedDebt(debt);
//                       setPaymentAmount("");
//                       setPaymentNote("");
//                     }}
//                     className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"
//                     title="To'lov"
//                   >
//                     <CheckCircle size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(debt)}
//                     className="bg-rose-50 text-rose-500 p-3 rounded-2xl"
//                     title="O'chirish"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//           {filteredDebts.length === 0 && (
//             <div className="text-center py-20 text-slate-300 font-black uppercase">
//               Qarzlar yo'q
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ========== ADD MODAL ========== */}
//       {isAddModalOpen && (
//         <Modal onClose={() => setIsAddModalOpen(false)}>
//           <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-xl font-black uppercase italic">
//                 Qarz qo'shish
//               </h2>
//               <button
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="p-2 bg-slate-50 rounded-full"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleAddNewDebt} className="space-y-4">
//               <input
//                 type="text"
//                 required
//                 autoFocus
//                 placeholder="Mijoz Ismi *"
//                 className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
//                 value={newDebt.name}
//                 onChange={(e) =>
//                   setNewDebt({ ...newDebt, name: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="+998 __ ___ __ __"
//                 className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
//                 value={newDebt.phone}
//                 onChange={(e) =>
//                   setNewDebt({ ...newDebt, phone: e.target.value })
//                 }
//               />
//               <input
//                 type="number"
//                 required
//                 min="1"
//                 placeholder="Qarz summasi (UZS) *"
//                 className="w-full bg-slate-50 p-5 rounded-2xl outline-none text-2xl font-black"
//                 value={newDebt.amount}
//                 onChange={(e) =>
//                   setNewDebt({ ...newDebt, amount: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Izoh (ixtiyoriy)"
//                 className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
//                 value={newDebt.note}
//                 onChange={(e) =>
//                   setNewDebt({ ...newDebt, note: e.target.value })
//                 }
//               />
//               <button
//                 type="submit"
//                 disabled={addLoading}
//                 className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black disabled:opacity-50"
//               >
//                 {addLoading ? "Saqlanmoqda..." : "Qo'shish"}
//               </button>
//             </form>
//           </div>
//         </Modal>
//       )}

//       {/* ========== PAYMENT MODAL ========== */}
//       {selectedDebt && (
//         <Modal
//           onClose={() => {
//             setSelectedDebt(null);
//             setPaymentAmount("");
//             setPaymentNote("");
//           }}
//           align="top"
//         >
//           <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-black uppercase italic">Qarzni yopish</h2>
//               <button
//                 onClick={() => {
//                   setSelectedDebt(null);
//                   setPaymentAmount("");
//                   setPaymentNote("");
//                 }}
//                 className="p-2 bg-slate-50 rounded-full"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="bg-rose-50 p-6 rounded-[2rem] text-center mb-6">
//               <p className="text-[10px] text-rose-400 uppercase font-black">
//                 {selectedDebt.customerName || selectedDebt.name}
//               </p>
//               <p className="text-2xl font-black text-rose-600">
//                 {Number(
//                   selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
//                 ).toLocaleString()}{" "}
//                 UZS
//               </p>
//               {selectedDebt.paidAmount > 0 && (
//                 <p className="text-[10px] text-emerald-500 mt-1">
//                   Ilgari to'langan:{" "}
//                   {Number(selectedDebt.paidAmount).toLocaleString()} UZS
//                 </p>
//               )}
//             </div>
//             <input
//               autoFocus
//               type="number"
//               min="1"
//               className="w-full bg-slate-50 rounded-[2rem] p-6 text-2xl font-black outline-none text-center mb-3"
//               value={paymentAmount}
//               onChange={(e) => setPaymentAmount(e.target.value)}
//               placeholder="To'lov summasi"
//             />
//             <input
//               type="text"
//               placeholder="Izoh (ixtiyoriy)"
//               className="w-full bg-slate-50 p-4 rounded-2xl outline-none mb-4"
//               value={paymentNote}
//               onChange={(e) => setPaymentNote(e.target.value)}
//             />
//             <div className="flex gap-2 mb-6">
//               {[25, 50, 100].map((pct) => {
//                 const val = Math.round(
//                   (Number(
//                     selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
//                   ) *
//                     pct) /
//                     100,
//                 );
//                 return (
//                   <button
//                     key={pct}
//                     onClick={() => setPaymentAmount(String(val))}
//                     className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black"
//                   >
//                     {pct}%
//                   </button>
//                 );
//               })}
//               <button
//                 onClick={() =>
//                   setPaymentAmount(
//                     String(
//                       selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
//                     ),
//                   )
//                 }
//                 className="flex-1 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black"
//               >
//                 To'liq
//               </button>
//             </div>
//             <button
//               onClick={handlePayment}
//               disabled={payLoading}
//               className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black disabled:opacity-50"
//             >
//               {payLoading ? "Saqlanmoqda..." : "To'lovni tasdiqlash"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ========== EDIT MODAL ========== */}
//       {editDebt && (
//         <Modal
//           onClose={() => {
//             setEditDebt(null);
//             setEditNote("");
//           }}
//         >
//           <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-black uppercase italic">Izoh tahrirlash</h2>
//               <button
//                 onClick={() => {
//                   setEditDebt(null);
//                   setEditNote("");
//                 }}
//                 className="p-2 bg-slate-50 rounded-full"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <p className="text-sm text-slate-500 mb-4 font-normal">
//               {editDebt.name}
//             </p>
//             <textarea
//               className="w-full bg-slate-50 p-4 rounded-2xl outline-none resize-none h-28"
//               placeholder="Izoh yozing..."
//               value={editNote}
//               onChange={(e) => setEditNote(e.target.value)}
//               autoFocus
//             />
//             <button
//               onClick={handleEditSave}
//               disabled={editLoading}
//               className="w-full mt-4 bg-blue-600 text-white py-4 rounded-3xl font-black disabled:opacity-50"
//             >
//               {editLoading ? "Saqlanmoqda..." : "Saqlash"}
//             </button>
//             <button
//               onClick={() => {
//                 setEditDebt(null);
//                 setEditNote("");
//               }}
//               className="w-full mt-2 text-slate-400 uppercase text-[9px]"
//             >
//               Bekor qilish
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* ========== DETAIL MODAL ========== */}
//       {detailDebt && (
//         <Modal onClose={() => setDetailDebt(null)} align="top">
//           <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl mb-6">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h2 className="font-black uppercase italic text-lg">
//                   {detailDebt.name}
//                 </h2>
//                 <p className="text-[10px] text-slate-400">{detailDebt.phone}</p>
//               </div>
//               <button
//                 onClick={() => setDetailDebt(null)}
//                 className="p-2 bg-slate-50 rounded-full"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="bg-rose-50 p-4 rounded-2xl text-center mb-6">
//               <p className="text-[9px] text-slate-400 uppercase">Jami qarz</p>
//               <p className="text-2xl font-black text-rose-600">
//                 {Number(
//                   detailDebt.remainingDebt || detailDebt.totalDebt || 0,
//                 ).toLocaleString()}{" "}
//                 UZS
//               </p>
//             </div>
//             <h3 className="font-black uppercase text-[10px] text-slate-400 mb-3">
//               Nasiyalar tarixi
//             </h3>
//             {detailLoading ? (
//               <p className="text-center text-slate-400 py-6">Yuklanmoqda...</p>
//             ) : detailNasiyalar.length === 0 ? (
//               <p className="text-center text-slate-300 py-6 uppercase text-[10px]">
//                 Tarix yo'q
//               </p>
//             ) : (
//               <div className="space-y-3 max-h-64 overflow-y-auto">
//                 {detailNasiyalar.map((n, i) => {
//                   const asl = Number(n.aslSumma || 0);
//                   const qolgan = Number(n.qolganQarz || n.qolganSumma || 0);
//                   const tolangan = Number(
//                     n.jamiTolangan || n.tolanganSumma || asl - qolgan || 0,
//                   );
//                   return (
//                     <div
//                       key={n.id || i}
//                       className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center"
//                     >
//                       <div>
//                         <p className="text-[10px] font-black text-slate-700">
//                           Asl: {asl.toLocaleString()} UZS
//                         </p>
//                         <p className="text-[9px] text-emerald-500">
//                           To'langan: {tolangan.toLocaleString()}
//                         </p>
//                         {n.izoh && (
//                           <p className="text-[9px] text-slate-400 mt-1">
//                             "{n.izoh}"
//                           </p>
//                         )}
//                         <p className="text-[8px] text-slate-300">
//                           {n.yaratilgan || n.createdAt || ""}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[9px] text-slate-400 uppercase">
//                           Qoldi
//                         </p>
//                         <p className="font-black text-rose-500">
//                           {qolgan.toLocaleString()}
//                         </p>
//                         <span
//                           className={`text-[8px] px-2 py-0.5 rounded-full ${n.status === "ACTIVE" ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-600"}`}
//                         >
//                           {n.status || "ACTIVE"}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//             <button
//               onClick={() => setDetailDebt(null)}
//               className="w-full mt-6 text-slate-400 uppercase text-[9px]"
//             >
//               Yopish
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

///////////////

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Search,
  Phone,
  UserX,
  CheckCircle,
  X,
  UserPlus,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../api/api";

const Modal = ({ children, onClose, align = "center" }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return ReactDOM.createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: align === "top" ? "flex-start" : "center",
        justifyContent: "center",
        padding: align === "top" ? "40px 16px 16px" : "16px",
        overflowY: "auto",
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

const normalizeCustomer = (d = {}) => {
  const name = d.ism || d.name || d.mijozIsmi || "Nomsiz";
  const phone = d.telefon || d.phone || "N/A";
  const totalDebt = Number(d.totalDebt || d.aslSumma || 0);
  const remainingDebt = Number(d.qolganQarz ?? d.remainingDebt ?? totalDebt);
  const paidAmount = Number(d.jamiTolangan || d.tolanganSumma || 0);
  return {
    id: String(d.id || d._id || Date.now()),
    customerId: String(d.id || d._id || ""),
    name,
    customerName: name,
    phone,
    totalDebt,
    paidAmount,
    remainingDebt: Math.max(0, remainingDebt),
    lastUpdate: d.yangilangan || d.updatedAt || d.createdAt || "",
    status: d.status || "ACTIVE",
    type: "api",
    items: [],
  };
};

const normalizeNasiya = (d = {}) => {
  const mijoz = d.mijoz || d.customer || {};
  const name =
    mijoz.ism || mijoz.name || d.ism || d.name || d.mijozIsmi || "Nomsiz";
  const phone = mijoz.telefon || mijoz.phone || d.telefon || d.phone || "N/A";
  const totalDebt = Number(d.aslSumma || d.totalDebt || 0);
  const paidAmount = Number(
    d.jamiTolangan || d.tolanganSumma || d.paidAmount || 0,
  );
  const remainingDebt = Number(
    d.qolganQarz ??
      d.qolganSumma ??
      d.remainingDebt ??
      totalDebt - paidAmount ??
      0,
  );
  return {
    id: String(d.id || d._id || Date.now()),
    customerId: String(mijoz.id || d.customerId || ""),
    name,
    customerName: name,
    phone,
    totalDebt,
    paidAmount,
    remainingDebt: Math.max(0, remainingDebt),
    lastUpdate: d.yangilangan || d.updatedAt || d.createdAt || "",
    status: d.status || "ACTIVE",
    type: "api",
    items: [],
  };
};

const extractNasiyalar = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.nasiyalar)) return res.nasiyalar;
  if (Array.isArray(res.mijozlar)) return res.mijozlar;
  if (Array.isArray(res.data?.nasiyalar)) return res.data.nasiyalar;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

const extractMijozlar = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.mijozlar)) return res.mijozlar;
  if (Array.isArray(res.data?.mijozlar)) return res.data.mijozlar;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

const findActiveNasiyaId = (nasiyalar, fallbackId) => {
  if (!nasiyalar || nasiyalar.length === 0) return fallbackId;
  const active = nasiyalar.find(
    (n) => n.status === "ACTIVE" || Number(n.qolganQarz || 0) > 0,
  );
  return active?.id || nasiyalar[0]?.id || fallbackId;
};

export default function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: "",
    phone: "",
    amount: "",
    note: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  // Mavjud mijoz topilganda tasdiqlash modali
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [pendingDebtData, setPendingDebtData] = useState(null);

  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  const [editDebt, setEditDebt] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [detailDebt, setDetailDebt] = useState(null);
  const [detailNasiyalar, setDetailNasiyalar] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  // ===================== LOAD =====================
  const loadDebts = async () => {
    try {
      setLoading(true);
      let result = [];

      try {
        const raw = await apiService.getNasiyaCustomers();
        const arr = extractMijozlar(raw);
        if (arr.length > 0) {
          result = arr.map(normalizeCustomer);
        }
      } catch (err) {
        console.warn("getNasiyaCustomers xatolik:", err?.message);
      }

      if (result.length === 0) {
        try {
          const raw = await apiService.getDebts();
          const arr = extractNasiyalar(raw);
          if (arr.length > 0) result = arr.map(normalizeNasiya);
        } catch (err) {
          console.warn("getDebts xatolik:", err?.message);
        }
      }

      if (result.length === 0) {
        const local = JSON.parse(localStorage.getItem("debts") || "[]");
        if (local.length > 0) {
          result = local;
        }
      }

      setDebts(result);
      if (result.length > 0)
        localStorage.setItem("debts", JSON.stringify(result));
    } catch (err) {
      console.error("loadDebts ERROR:", err);
      setDebts(JSON.parse(localStorage.getItem("debts") || "[]"));
    } finally {
      setLoading(false);
    }
  };

  // ===================== DETAIL =====================
  const handleViewDetail = async (debt) => {
    setDetailDebt(debt);
    setDetailNasiyalar([]);
    setDetailLoading(true);
    try {
      const res = await apiService.getCustomerDebtsRaw(
        debt.customerId || debt.id,
      );
      const arr = extractNasiyalar(res);
      setDetailNasiyalar(arr);
    } catch (err) {
      console.warn("getCustomerDebts xatolik:", err?.message);
      setDetailNasiyalar([]);
    } finally {
      setDetailLoading(false);
    }
  };

  // ===================== ADD — ASOSIY LOGIKA =====================
  const handleAddNewDebt = async (e) => {
    e.preventDefault();
    const amount = Number(newDebt.amount);
    if (!newDebt.name.trim()) return toast.error("Mijoz ismini kiriting!");
    if (!amount || amount <= 0) return toast.error("Qarz miqdorini kiriting!");

    setAddLoading(true);
    try {
      // ✅ 1-qadam: Telefon kiritilgan bo'lsa, avval bazada borligini tekshir
      if (newDebt.phone.trim()) {
        const searchRes = await apiService.getNasiyaCustomers(
          newDebt.phone.trim(),
        );
        const mijozlar = extractMijozlar(searchRes);
        const topilgan = mijozlar.find(
          (m) =>
            (m.telefon || m.phone || "").replace(/\s/g, "") ===
            newDebt.phone.trim().replace(/\s/g, ""),
        );

        if (topilgan) {
          // ✅ Mijoz bor — tasdiqlash oynasini ko'rsat
          setExistingCustomer(topilgan);
          setPendingDebtData({ amount, note: newDebt.note.trim() });
          setAddLoading(false);
          return;
        }
      }

      // ✅ 2-qadam: Mijoz yo'q — yangi mijoz + nasiya birga yaratish
      await apiService.createDebtWithCustomer({
        mijozIsmi: newDebt.name.trim(),
        telefon: newDebt.phone.trim() || undefined,
        aslSumma: amount,
        izoh: newDebt.note.trim() || undefined,
      });

      toast.success("Yangi mijoz va qarz qo'shildi!");
      setNewDebt({ name: "", phone: "", amount: "", note: "" });
      setIsAddModalOpen(false);
      setTimeout(() => loadDebts(), 800);
    } catch (err) {
      console.error("ADD ERROR:", err);
      toast.error("Xatolik: " + (err?.message || "Server xatosi"));
    } finally {
      setAddLoading(false);
    }
  };

  // ✅ Mavjud mijozga qarz qo'shishni tasdiqlash
  const handleConfirmAddToExisting = async () => {
    if (!existingCustomer || !pendingDebtData) return;
    setAddLoading(true);
    try {
      const customerId = existingCustomer.id || existingCustomer._id;
      await apiService.createDebt({
        customerId: String(customerId),
        aslSumma: pendingDebtData.amount,
        izoh: pendingDebtData.note || undefined,
      });
      toast.success(
        `${existingCustomer.ism || existingCustomer.name} ga yangi qarz qo'shildi!`,
      );
      setExistingCustomer(null);
      setPendingDebtData(null);
      setNewDebt({ name: "", phone: "", amount: "", note: "" });
      setIsAddModalOpen(false);
      setTimeout(() => loadDebts(), 800);
    } catch (err) {
      console.error("Mavjud mijozga qarz qo'shish xatosi:", err);
      toast.error("Xatolik: " + (err?.message || ""));
    } finally {
      setAddLoading(false);
    }
  };

  // ===================== PAYMENT =====================
  // const handlePayment = async () => {
  //   const amount = Number(paymentAmount);
  //   if (!amount || amount <= 0)
  //     return toast.error("To'lov summasini kiriting!");
  //   const maxAmount = Number(
  //     selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
  //   );
  //   if (amount > maxAmount)
  //     return toast.error(`Maksimal: ${maxAmount.toLocaleString()} UZS`);

  //   setPayLoading(true);
  //   try {
  //     let nasiyaId = selectedDebt.id;

  //     if (selectedDebt.customerId) {
  //       try {
  //         const res = await apiService.getCustomerDebtsRaw(
  //           selectedDebt.customerId,
  //         );
  //         const arr = extractNasiyalar(res);
  //         nasiyaId = findActiveNasiyaId(arr, nasiyaId);
  //       } catch (e) {
  //         console.warn("nasiyaId topishda xato:", e?.message);
  //       }
  //     }

  //     await apiService.payDebt(
  //       nasiyaId,
  //       amount,
  //       paymentNote.trim() || undefined,
  //     );
  //     toast.success("To'lov qabul qilindi!");
  //     setSelectedDebt(null);
  //     setPaymentAmount("");
  //     setPaymentNote("");
  //     setTimeout(() => loadDebts(), 800);
  //   } catch (err) {
  //     console.warn("payDebt xatolik:", err?.message);
  //     const updated = debts.map((d) => {
  //       if (String(d.id) !== String(selectedDebt.id)) return d;
  //       const newRemaining = Math.max(
  //         0,
  //         Number(d.remainingDebt || d.totalDebt || 0) - amount,
  //       );
  //       return {
  //         ...d,
  //         paidAmount: Number(d.paidAmount || 0) + amount,
  //         remainingDebt: newRemaining,
  //         status: newRemaining === 0 ? "CLOSED" : "ACTIVE",
  //         lastUpdate: new Date().toLocaleString(),
  //       };
  //     });
  //     setDebts(updated);
  //     localStorage.setItem("debts", JSON.stringify(updated));
  //     toast.success("To'lov saqlandi (local)");
  //     setSelectedDebt(null);
  //     setPaymentAmount("");
  //     setPaymentNote("");
  //   } finally {
  //     setPayLoading(false);
  //   }
  // };

  const handlePayment = async () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0)
      return toast.error("To'lov summasini kiriting!");

    const maxAmount = Number(
      selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
    );
    if (amount > maxAmount)
      return toast.error(`Maksimal: ${maxAmount.toLocaleString()} UZS`);

    setPayLoading(true);
    try {
      // ── Avval customer ning nasiyalarini olamiz ──
      const customerId = selectedDebt.customerId || selectedDebt.id;
      const res = await apiService.getCustomerDebtsRaw(customerId);

      console.log("RAW nasiyalar response:", JSON.stringify(res));

      // ── Barcha mumkin bo'lgan strukturalardan nasiyalar arrayini olamiz ──
      let nasiyalarArr = [];
      if (Array.isArray(res)) nasiyalarArr = res;
      else if (Array.isArray(res?.nasiyalar)) nasiyalarArr = res.nasiyalar;
      else if (Array.isArray(res?.data?.nasiyalar))
        nasiyalarArr = res.data.nasiyalar;
      else if (Array.isArray(res?.data)) nasiyalarArr = res.data;

      console.log("Nasiyalar array:", nasiyalarArr);

      // ── ACTIVE nasiyani topamiz ──
      const activeNasiya =
        nasiyalarArr.find(
          (n) => n.status === "ACTIVE" && Number(n.qolganQarz || 0) > 0,
        ) || nasiyalarArr[0];

      if (!activeNasiya?.id) {
        return toast.error("Faol nasiya topilmadi!");
      }

      console.log("To'lov yuborilayotgan nasiyaId:", activeNasiya.id);

      await apiService.payDebt(
        activeNasiya.id,
        amount,
        paymentNote.trim() || undefined,
      );

      toast.success("To'lov qabul qilindi!");
      setSelectedDebt(null);
      setPaymentAmount("");
      setPaymentNote("");
      setTimeout(() => loadDebts(), 800);
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      toast.error("To'lovda xatolik: " + (err?.message || ""));
    } finally {
      setPayLoading(false);
    }
  };

  // ===================== EDIT =====================
  const handleEditSave = async () => {
    if (!editDebt) return;
    if (!editNote.trim()) return toast.error("Izoh kiriting!");

    setEditLoading(true);
    try {
      let nasiyaId = editDebt.id;

      if (editDebt.customerId) {
        try {
          const res = await apiService.getCustomerDebtsRaw(editDebt.customerId);
          const arr = extractNasiyalar(res);
          nasiyaId = findActiveNasiyaId(arr, nasiyaId);
        } catch (e) {
          console.warn("nasiyaId topishda xato:", e?.message);
        }
      }

      await apiService.updateDebt(nasiyaId, { izoh: editNote.trim() });
      toast.success("Izoh yangilandi!");
      setEditDebt(null);
      setEditNote("");
      setTimeout(() => loadDebts(), 800);
    } catch (err) {
      console.error("EDIT ERROR:", err);
      toast.error("Tahrirlashda xatolik: " + (err?.message || "Server xatosi"));
    } finally {
      setEditLoading(false);
    }
  };

  // ===================== DELETE =====================
  const handleDelete = async (debt) => {
    if (!window.confirm(`"${debt.name}" ni o'chirasizmi?`)) return;
    try {
      let deleted = false;
      if (debt.customerId) {
        try {
          const res = await apiService.getCustomerDebtsRaw(debt.customerId);
          const arr = extractNasiyalar(res);
          for (const n of arr) {
            await apiService.deleteDebt(n.id);
          }
          deleted = true;
        } catch (e) {
          console.warn("nasiyalarni o'chirishda xato:", e?.message);
        }
      }
      if (!deleted) {
        await apiService.deleteDebt(debt.id);
      }
      toast.success("O'chirildi!");
      setTimeout(() => loadDebts(), 800);
    } catch (err) {
      toast.error("O'chirishda xatolik: " + (err?.message || ""));
    }
  };

  const filteredDebts = debts.filter((d) => {
    const hasDebt = Number(d.remainingDebt || d.totalDebt || 0) > 0;
    const matchSearch = String(d.customerName || d.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return hasDebt && matchSearch;
  });

  const totalDebt = filteredDebts.reduce(
    (s, d) => s + Number(d.remainingDebt || d.totalDebt || 0),
    0,
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black">
        Yuklanmoqda...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 italic font-bold">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center">
              <UserX size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic text-slate-900">
                Nasiyalar
              </h1>
              <p className="text-[10px] text-slate-400 uppercase">
                Jami qarz: {totalDebt.toLocaleString()} UZS ·{" "}
                {filteredDebts.length} ta mijoz
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-4 top-3 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-2xl outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
            >
              <UserPlus size={18} /> Yangi Qarz
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDebts.map((debt) => {
            const name = debt.customerName || debt.name || "Nomsiz";
            const amount = Number(debt.remainingDebt || debt.totalDebt || 0);
            return (
              <div
                key={debt.id}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black italic border">
                    {String(name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-slate-800">
                      {name}
                    </h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <Phone size={10} />
                      {debt.phone || "N/A"}
                    </p>
                    <p className="text-[9px] text-slate-300">
                      {debt.lastUpdate || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="text-[9px] uppercase text-slate-400">Qarz</p>
                    <p className="text-lg font-black text-rose-600">
                      {amount.toLocaleString()} UZS
                    </p>
                    {debt.paidAmount > 0 && (
                      <p className="text-[9px] text-emerald-500">
                        To'langan: {Number(debt.paidAmount).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewDetail(debt)}
                    className="bg-slate-50 text-slate-500 p-3 rounded-2xl"
                    title="Tarix"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditDebt(debt);
                      setEditNote("");
                    }}
                    className="bg-blue-50 text-blue-500 p-3 rounded-2xl"
                    title="Tahrirlash"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDebt(debt);
                      setPaymentAmount("");
                      setPaymentNote("");
                    }}
                    className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"
                    title="To'lov"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(debt)}
                    className="bg-rose-50 text-rose-500 p-3 rounded-2xl"
                    title="O'chirish"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredDebts.length === 0 && (
            <div className="text-center py-20 text-slate-300 font-black uppercase">
              Qarzlar yo'q
            </div>
          )}
        </div>
      </div>

      {/* ========== ADD MODAL ========== */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic">
                Qarz qo'shish
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddNewDebt} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                placeholder="Mijoz Ismi *"
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
                value={newDebt.name}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="+998 __ ___ __ __"
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
                value={newDebt.phone}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, phone: e.target.value })
                }
              />
              <input
                type="number"
                required
                min="1"
                placeholder="Qarz summasi (UZS) *"
                className="w-full bg-slate-50 p-5 rounded-2xl outline-none text-2xl font-black"
                value={newDebt.amount}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, amount: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Izoh (ixtiyoriy)"
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
                value={newDebt.note}
                onChange={(e) =>
                  setNewDebt({ ...newDebt, note: e.target.value })
                }
              />
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black disabled:opacity-50"
              >
                {addLoading ? "Tekshirilmoqda..." : "Qo'shish"}
              </button>
            </form>
          </div>
        </Modal>
      )}

      {/* ========== MAVJUD MIJOZ TASDIQLASH MODALI ========== */}
      {existingCustomer && pendingDebtData && (
        <Modal
          onClose={() => {
            setExistingCustomer(null);
            setPendingDebtData(null);
          }}
        >
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase italic text-orange-500">
                Mijoz topildi!
              </h2>
              <button
                onClick={() => {
                  setExistingCustomer(null);
                  setPendingDebtData(null);
                }}
                className="p-2 bg-slate-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mavjud mijoz ma'lumotlari */}
            <div className="bg-orange-50 p-5 rounded-2xl mb-5">
              <p className="text-[9px] text-orange-400 uppercase font-black mb-2">
                Bu raqam allaqachon ro'yxatdan o'tgan
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-lg">
                  {String(existingCustomer.ism || existingCustomer.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-800 uppercase">
                    {existingCustomer.ism || existingCustomer.name}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Phone size={9} />
                    {existingCustomer.telefon || existingCustomer.phone}
                  </p>
                  {Number(existingCustomer.totalDebt || 0) > 0 && (
                    <p className="text-[10px] text-rose-500 font-black">
                      Mavjud qarz:{" "}
                      {Number(existingCustomer.totalDebt || 0).toLocaleString()}{" "}
                      UZS
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Yangi qarz summasi */}
            <div className="bg-slate-50 p-4 rounded-2xl mb-5 text-center">
              <p className="text-[9px] text-slate-400 uppercase">
                Qo'shilajak yangi qarz
              </p>
              <p className="text-2xl font-black text-slate-800">
                {Number(pendingDebtData.amount).toLocaleString()} UZS
              </p>
              {pendingDebtData.note && (
                <p className="text-[10px] text-slate-400 mt-1">
                  "{pendingDebtData.note}"
                </p>
              )}
            </div>

            <p className="text-[10px] text-slate-500 text-center mb-5">
              Ushbu mijozga yangi qarz qo'shilsinmi?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setExistingCustomer(null);
                  setPendingDebtData(null);
                }}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase"
              >
                Bekor
              </button>
              <button
                onClick={handleConfirmAddToExisting}
                disabled={addLoading}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase disabled:opacity-50"
              >
                {addLoading ? "..." : "Ha, qo'shish"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========== PAYMENT MODAL ========== */}
      {selectedDebt && (
        <Modal
          onClose={() => {
            setSelectedDebt(null);
            setPaymentAmount("");
            setPaymentNote("");
          }}
          align="top"
        >
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase italic">Qarzni yopish</h2>
              <button
                onClick={() => {
                  setSelectedDebt(null);
                  setPaymentAmount("");
                  setPaymentNote("");
                }}
                className="p-2 bg-slate-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-rose-50 p-6 rounded-[2rem] text-center mb-6">
              <p className="text-[10px] text-rose-400 uppercase font-black">
                {selectedDebt.customerName || selectedDebt.name}
              </p>
              <p className="text-2xl font-black text-rose-600">
                {Number(
                  selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
                ).toLocaleString()}{" "}
                UZS
              </p>
              {selectedDebt.paidAmount > 0 && (
                <p className="text-[10px] text-emerald-500 mt-1">
                  Ilgari to'langan:{" "}
                  {Number(selectedDebt.paidAmount).toLocaleString()} UZS
                </p>
              )}
            </div>
            <input
              autoFocus
              type="number"
              min="1"
              className="w-full bg-slate-50 rounded-[2rem] p-6 text-2xl font-black outline-none text-center mb-3"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="To'lov summasi"
            />
            <input
              type="text"
              placeholder="Izoh (ixtiyoriy)"
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none mb-4"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
            />
            <div className="flex gap-2 mb-6">
              {[25, 50, 100].map((pct) => {
                const val = Math.round(
                  (Number(
                    selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
                  ) *
                    pct) /
                    100,
                );
                return (
                  <button
                    key={pct}
                    onClick={() => setPaymentAmount(String(val))}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black"
                  >
                    {pct}%
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPaymentAmount(
                    String(
                      selectedDebt.remainingDebt || selectedDebt.totalDebt || 0,
                    ),
                  )
                }
                className="flex-1 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black"
              >
                To'liq
              </button>
            </div>
            <button
              onClick={handlePayment}
              disabled={payLoading}
              className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black disabled:opacity-50"
            >
              {payLoading ? "Saqlanmoqda..." : "To'lovni tasdiqlash"}
            </button>
          </div>
        </Modal>
      )}

      {/* ========== EDIT MODAL ========== */}
      {editDebt && (
        <Modal
          onClose={() => {
            setEditDebt(null);
            setEditNote("");
          }}
        >
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase italic">Izoh tahrirlash</h2>
              <button
                onClick={() => {
                  setEditDebt(null);
                  setEditNote("");
                }}
                className="p-2 bg-slate-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4 font-normal">
              {editDebt.name}
            </p>
            <textarea
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none resize-none h-28"
              placeholder="Izoh yozing..."
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleEditSave}
              disabled={editLoading}
              className="w-full mt-4 bg-blue-600 text-white py-4 rounded-3xl font-black disabled:opacity-50"
            >
              {editLoading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button
              onClick={() => {
                setEditDebt(null);
                setEditNote("");
              }}
              className="w-full mt-2 text-slate-400 uppercase text-[9px]"
            >
              Bekor qilish
            </button>
          </div>
        </Modal>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {detailDebt && (
        <Modal onClose={() => setDetailDebt(null)} align="top">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-black uppercase italic text-lg">
                  {detailDebt.name}
                </h2>
                <p className="text-[10px] text-slate-400">{detailDebt.phone}</p>
              </div>
              <button
                onClick={() => setDetailDebt(null)}
                className="p-2 bg-slate-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl text-center mb-6">
              <p className="text-[9px] text-slate-400 uppercase">Jami qarz</p>
              <p className="text-2xl font-black text-rose-600">
                {Number(
                  detailDebt.remainingDebt || detailDebt.totalDebt || 0,
                ).toLocaleString()}{" "}
                UZS
              </p>
            </div>
            <h3 className="font-black uppercase text-[10px] text-slate-400 mb-3">
              Nasiyalar tarixi
            </h3>
            {detailLoading ? (
              <p className="text-center text-slate-400 py-6">Yuklanmoqda...</p>
            ) : detailNasiyalar.length === 0 ? (
              <p className="text-center text-slate-300 py-6 uppercase text-[10px]">
                Tarix yo'q
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {detailNasiyalar.map((n, i) => {
                  const asl = Number(n.aslSumma || 0);
                  const qolgan = Number(n.qolganQarz || n.qolganSumma || 0);
                  const tolangan = Number(
                    n.jamiTolangan || n.tolanganSumma || asl - qolgan || 0,
                  );
                  return (
                    <div
                      key={n.id || i}
                      className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center"
                    >
                      <div>
                        <p className="text-[10px] font-black text-slate-700">
                          Asl: {asl.toLocaleString()} UZS
                        </p>
                        <p className="text-[9px] text-emerald-500">
                          To'langan: {tolangan.toLocaleString()}
                        </p>
                        {n.izoh && (
                          <p className="text-[9px] text-slate-400 mt-1">
                            "{n.izoh}"
                          </p>
                        )}
                        <p className="text-[8px] text-slate-300">
                          {n.yaratilgan || n.createdAt || ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 uppercase">
                          Qoldi
                        </p>
                        <p className="font-black text-rose-500">
                          {qolgan.toLocaleString()}
                        </p>
                        <span
                          className={`text-[8px] px-2 py-0.5 rounded-full ${n.status === "ACTIVE" ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-600"}`}
                        >
                          {n.status || "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => setDetailDebt(null)}
              className="w-full mt-6 text-slate-400 uppercase text-[9px]"
            >
              Yopish
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

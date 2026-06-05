import React, { useState, useEffect } from "react";
import { apiService } from "../api/api";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Beef,
  Loader2,
  Search,
  Package,
  Pencil,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Go'sht",
    tannarx: "",
    sotish: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await apiService.getProducts();
      const data = Array.isArray(res) ? res : res?.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Yuklashda xato:", err);
      setProducts([]);
      toast.error("Mahsulotlarni yuklashda xato");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.tannarx || !form.sotish) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring!");
    }

    const productData = {
      name: form.name,
      category: form.category,
      tannarx: Number(form.tannarx),
      sotish: Number(form.sotish),
    };

    try {
      if (editId) {
        await apiService.updateProduct(editId, productData);
        toast.success("Mahsulot muvaffaqiyatli tahrirlandi");
        setEditId(null);
      } else {
        await apiService.addProduct(productData);
        toast.success("Mahsulot muvaffaqiyatli qo'shildi");
      }

      setForm({
        name: "",
        category: "Go'sht",
        tannarx: "",
        sotish: "",
      });

      loadProducts();
    } catch (err) {
      console.error("Saqlashda xato:", err);
      toast.error("Saqlashda xatolik yuz berdi");
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Go'sht",
      tannarx: product.tannarx || "",
      sotish: product.sotish || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditId(null);

    setForm({
      name: "",
      category: "Go'sht",
      tannarx: "",
      sotish: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ushbu mahsulotni o'chirishga aminmisiz?")) {
      try {
        await apiService.deleteProduct(id);
        toast.success("Mahsulot o'chirildi");
        loadProducts();
      } catch (err) {
        console.error("O'chirishda xato:", err);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 italic font-bold max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
            <Package className="text-emerald-500" size={40} />
            Mahsulotlar
          </h1>
          <p className="text-gray-400 text-sm uppercase mt-1">
            Jami: {products.length} turdagi mahsulot
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-[2rem] shadow-sm border-none focus:ring-4 ring-emerald-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div
            className={`bg-white p-8 rounded-[3rem] shadow-xl border-4 sticky top-6 ${
              editId ? "border-orange-500/30" : "border-emerald-500/20"
            }`}
          >
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              {editId ? (
                <>
                  <Pencil className="text-orange-500" />
                  Mahsulotni tahrirlash
                </>
              ) : (
                <>
                  <Plus className="text-emerald-500" />
                  Yangi Mahsulot
                </>
              )}
            </h2>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-400 ml-2">
                  Nomi
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-emerald-500 transition-all"
                  placeholder="Masalan: Lahm go'sht"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-400 ml-2">
                  Kategoriya
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-emerald-500 transition-all"
                  placeholder="Masalan: Go'sht"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 ml-2">
                    Tannarx
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-emerald-500 transition-all"
                    placeholder="0"
                    value={form.tannarx}
                    onChange={(e) =>
                      setForm({ ...form, tannarx: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 ml-2">
                    Sotish
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-emerald-500 transition-all"
                    placeholder="0"
                    value={form.sotish}
                    onChange={(e) =>
                      setForm({ ...form, sotish: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-5 text-white rounded-[2rem] font-black uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4 ${
                  editId
                    ? "bg-orange-500 shadow-orange-500/30"
                    : "bg-emerald-500 shadow-emerald-500/30"
                }`}
              >
                {editId ? "O'zgarishni saqlash" : "Ro'yxatga qo'shish"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full py-4 bg-slate-200 text-slate-700 rounded-[2rem] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-300 transition-all"
                >
                  <X size={18} />
                  Bekor qilish
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Beef size={24} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 text-slate-300 hover:text-orange-500 transition-colors"
                      title="Tahrirlash"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase text-slate-800 mb-1 truncate">
                  {p.name}
                </h3>

                <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-gray-500 uppercase">
                  {p.category}
                </span>

                <div className="mt-6 flex justify-between items-end border-t border-dashed pt-4">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase">
                      Sotuv narxi
                    </p>
                    <p className="text-2xl font-black text-emerald-600 tracking-tighter">
                      {Number(p.sotish || 0).toLocaleString()}{" "}
                      <span className="text-xs">UZS</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase">
                      Tannarx
                    </p>
                    <p className="text-sm font-bold text-slate-400 line-through">
                      {Number(p.tannarx || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform">
                  <Beef size={100} />
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
              <Package className="mx-auto text-slate-200 mb-4" size={64} />
              <p className="text-slate-400 uppercase">Hech narsa topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
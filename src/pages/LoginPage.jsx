import React, { useState } from "react";
import { apiService } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Beef, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.login(form);

      console.warn(res);

      const token =
        res?.token || res?.data?.token || res?.user_token || res?.access_token;

      if (token) {
        localStorage.setItem("user_token", token);
        toast.success("Xush kelibsiz!");
        navigate("/");
      } else {
        toast.error("Serverdan token kelmadi!");
      }
    } catch (err) {
      console.error("Login xatosi:", err);
      toast.error("Server bilan ulanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 italic font-bold">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-emerald-500">
        <div className="text-center mb-8">
          <div className="bg-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <Beef size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            MeatPOS
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs ml-4 text-gray-400 uppercase">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs ml-4 text-gray-400 uppercase">
              Parol
            </label>
            <input
              type="password"
              required
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-emerald-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase hover:bg-emerald-600 transition-all flex justify-center mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}

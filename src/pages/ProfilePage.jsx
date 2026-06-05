import React, { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, LogOut, ShieldCheck, 
  Settings, Camera, Store, Save, Key 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Sifat Broyler",
    role: "Admin / Do'kon Egasi",
    email: "sifat_broyler066@gmail.com",
    phone: "+998 94 806 00 66",
    address: "Farg'ona, Yozyovon tumani",
    joinDate: "2024-yil yanvar"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    // Tizimdan chiqish mantiqi
    if(window.confirm("Tizimdan chiqmoqchimisiz?")) {
      localStorage.removeItem("isLoggedIn"); // Masalan
      window.location.href = "/login";
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Ma'lumotlar saqlandi!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 italic font-bold text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Orqa fondagi bezak */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl">
              <User size={64} className="text-slate-300" />
            </div>
            <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:bg-emerald-500 transition-all">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tight">{user.name}</h1>
            <p className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-[10px] inline-block uppercase">
              {user.role}
            </p>
            <p className="text-slate-400 text-xs flex items-center justify-center md:justify-start gap-2">
              <Store size={14} /> {user.address}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* ASOSIY MA'LUMOTLAR */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-3 italic">
                  <Settings className="text-slate-400" /> Shaxsiy Sozlamalar
                </h2>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`px-6 py-2 rounded-xl text-[10px] uppercase transition-all ${isEditing ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {isEditing ? <span className="flex items-center gap-2"><Save size={14}/> Saqlash</span> : "Tahrirlash"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-slate-400 ml-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input 
                      type="email" disabled={!isEditing}
                      className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border-2 border-transparent focus:border-slate-900 font-bold"
                      value={user.email} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-slate-400 ml-2">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input 
                      type="text" disabled={!isEditing}
                      className="w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none border-2 border-transparent focus:border-slate-900 font-bold"
                      value={user.phone} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="text-xs uppercase flex items-center gap-2 mb-4">
                  <Key size={14} className="text-amber-500" /> Xavfsizlik
                </h3>
                <button className="w-full bg-slate-50 p-4 rounded-2xl text-left text-xs flex justify-between items-center hover:bg-slate-100 transition-all">
                  <span>Parolni o'zgartirish</span>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </button>
              </div>
            </div>
          </div>

          {/* STATISTIKA VA CHIQISH */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl space-y-6">
              <div>
                <p className="text-[9px] uppercase text-slate-500 mb-1">A'zolik sanasi</p>
                <p className="text-sm font-black italic">{user.joinDate}</p>
              </div>
              <div className="h-[1px] bg-white/10 w-full"></div>
              <div>
                <p className="text-[9px] uppercase text-slate-500 mb-1">Tizim holati</p>
                <p className="text-sm font-black text-emerald-400 italic">Faol (Litsenziya bor)</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-rose-50 text-rose-500 p-8 rounded-[3rem] flex flex-col items-center gap-3 hover:bg-rose-500 hover:text-white transition-all group"
            >
              <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase text-[10px] tracking-[0.2em] font-black">Tizimdan chiqish</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
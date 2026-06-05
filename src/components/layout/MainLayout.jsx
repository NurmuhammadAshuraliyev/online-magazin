import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Warehouse,
  Users,
  PieChart,
  LogOut,
  User,
  ShoppingCart,
  Banknote,
  Bell,
  Menu,
  X,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-[12px] font-black uppercase transition-all ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "text-slate-500 hover:bg-slate-100 hover:text-blue-600"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Panel" },
    { to: "/products", icon: ShoppingBag, label: "Mahsulot" },
    { to: "/warehouse", icon: Warehouse, label: "Ombor" },
    { to: "/sales", icon: ShoppingCart, label: "Sotuv" },
    { to: "/debts", icon: Users, label: "Nasiya" },
    { to: "/cashflow", icon: Banknote, label: "Kassa" },
    { to: "/reports", icon: PieChart, label: "Hisobot" },
    { to: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans">
      <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-11 h-11 rounded-2xl object-cover border border-blue-100"
            />

            <div>
              <h1 className="text-lg font-black tracking-tighter">
                MEAT<span className="text-blue-600">POS</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Sifat Broyler
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="p-3 rounded-2xl bg-slate-100 text-slate-700"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute left-0 top-0 h-full w-[280px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black">
                  MEAT<span className="text-blue-600">POS</span>
                </h2>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Menu
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {links.map((item) => (
                <NavItem
                  key={item.to}
                  {...item}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all font-black text-[12px] uppercase"
            >
              <LogOut size={18} />
              Chiqish
            </button>
          </aside>
        </div>
      )}

      <div className="lg:flex">
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-100 p-5 flex-col">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-2xl object-cover border border-blue-100"
            />

            <div>
              <h1 className="text-xl font-black tracking-tighter">
                MEAT<span className="text-blue-600">POS</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Sifat Broyler
              </p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {links.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>

          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 font-black text-[12px] uppercase">
              <Bell size={18} />
              Bildirishnoma
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all font-black text-[12px] uppercase"
            >
              <LogOut size={18} />
              Chiqish
            </button>
          </div>
        </aside>

        <main className="w-full lg:ml-[260px] p-3 sm:p-4 md:p-6">
          <div className="bg-white/80 backdrop-blur-md rounded-[22px] sm:rounded-[30px] border border-white p-3 sm:p-5 md:p-8 min-h-[calc(100vh-90px)] shadow-sm overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
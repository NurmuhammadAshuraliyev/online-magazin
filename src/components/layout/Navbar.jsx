import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Boxes,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  UserCircle,
  Menu,
  X,
  Banknote,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Sahifa o'zgarganda mobil menyuni avtomatik yopish
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const navLinks = [
    { name: "Asosiy", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Mahsulotlar", path: "/products", icon: <Boxes size={20} /> },
    { name: "Ombor", path: "/warehouse", icon: <Package size={20} /> },
    { name: "Sotuv", path: "/sales", icon: <ShoppingCart size={20} /> },
    { name: "Nasiya", path: "/debts", icon: <Users size={20} /> },
    { name: "Kassa", path: "/cashflow", icon: <Banknote size={20} /> },
    { name: "Hisobotlar", path: "/reports", icon: <BarChart3 size={20} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-9 w-auto hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* CENTER: Desktop Navigation (Faqat katta ekranlar uchun) */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* RIGHT: Profile & Logout & Burger */}
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className={`p-2 rounded-full transition-colors ${
                location.pathname === "/profile" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <UserCircle size={24} />
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
              title="Chiqish"
            >
              <LogOut size={22} />
            </button>

            {/* Burger Menu (Mobil uchun) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Slide Down Animation) */}
      <div 
        className={`xl:hidden absolute w-full bg-white border-b border-slate-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-colors ${
                location.pathname === item.path
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className={location.pathname === item.path ? "text-white" : "text-slate-400"}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-rose-50 text-rose-600 font-bold uppercase text-[13px]"
            >
              <LogOut size={20} /> Chiqish
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
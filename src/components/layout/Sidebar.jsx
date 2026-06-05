import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Box, Warehouse, ShoppingCart, 
  FileText, BarChart3, Settings, LogOut 
} from "lucide-react";

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/products", icon: Box, label: "Mahsulotlar" },
  { path: "/warehouse", icon: Warehouse, label: "Ombor" },
  { path: "/sales", icon: ShoppingCart, label: "Sotuv (POS)" },
  { path: "/receipts", icon: FileText, label: "Cheklar" },
  { path: "/reports", icon: BarChart3, label: "Hisobotlar" },
  { path: "/settings", icon: Settings, label: "Sozlamalar" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <Warehouse size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            StockPro
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? "gradient-primary text-white shadow-md" 
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </aside>
  );
}
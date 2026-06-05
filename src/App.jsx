import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import WarehousePage from "./pages/WarehousePage";
import SalesPage from "./pages/SalesPage";
import DebtsPage from "./pages/DebtsPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import CashFlowPage from "./pages/CashFlowPage";
const Protected = ({ children }) => {
  const token = localStorage.getItem("user_token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <MainLayout />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/cashflow" element={<CashFlowPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          {/* <Route path="warehouse/history" element={<StockHistoryPage />} /> ✅
          YANGI */}
          <Route path="sales" element={<SalesPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

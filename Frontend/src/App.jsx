// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root component — manages auth state, renders Login or Dashboard
// Uses sessionStorage to persist login across page refresh within the session

import React, { useState, useEffect } from "react";
import LoginPage    from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PurchasePage from "./pages/PurchasePage";
import OtherExpensePage from "./pages/OtherExpensePage";
import { ToastContainer, useToast } from "./components/Toast";
import { FiHome, FiShoppingCart, FiDollarSign, FiLogOut } from "react-icons/fi";
import "./index.css";

// ── Auth key in sessionStorage ─────────────────────────────────────────────
const AUTH_KEY = "parth_mango_auth";
const PAGE_KEY = "parth_current_page";

export default function App() {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check session on initial render
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });

  // ── Page navigation ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(() => {
    return sessionStorage.getItem(PAGE_KEY) || "dashboard";
  });

  // ── Toast system ───────────────────────────────────────────────────────────
  const { toasts, toast, removeToast } = useToast();

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(PAGE_KEY);
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    toast.info("Logged out successfully");
  };

  const handlePageChange = (page) => {
    sessionStorage.setItem(PAGE_KEY, page);
    setCurrentPage(page);
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Mango",
      icon: FiHome,
      activeClass: "border border-amber-400/30 bg-amber-500/20 text-amber-300",
    },
    {
      id: "purchase",
      label: "Purchase",
      icon: FiShoppingCart,
      activeClass: "border border-cyan-400/30 bg-cyan-500/20 text-cyan-300",
    },
    {
      id: "expense",
      label: "Expenses",
      icon: FiDollarSign,
      activeClass: "border border-emerald-400/30 bg-emerald-500/20 text-emerald-300",
    },
  ];

  // ── Render current page ────────────────────────────────────────────────────
  const renderPage = () => {
    switch (currentPage) {
      case "purchase":
        return <PurchasePage onLogout={handleLogout} toast={toast} />;
      case "expense":
        return <OtherExpensePage onLogout={handleLogout} toast={toast} />;
      case "dashboard":
      default:
        return <DashboardPage onLogout={handleLogout} toast={toast} />;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Page routing — simple auth gate */}
      {isLoggedIn ? (
        <div className="flex h-screen flex-col bg-slate-950 md:flex-row">
          {/* Desktop Sidebar Navigation */}
          <nav className="hidden w-16 flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-[12px_0_40px_rgba(0,0,0,0.35)] md:flex md:w-64">
            {/* Logo */}
            <div className="border-b border-white/10 bg-white/5 p-4">
              <h1 className="hidden text-xl font-display font-bold text-amber-300 md:block">Kesar King</h1>
              <div className="md:hidden text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-cyan-400/20">
                  <span className="font-bold text-amber-300">EK</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-1 flex-col gap-2 p-3">
              <button
                onClick={() => handlePageChange("dashboard")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === "dashboard"
                    ? "border border-amber-400/30 bg-amber-500/20 text-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FiHome className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">Mango</span>
              </button>
              <button
                onClick={() => handlePageChange("purchase")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === "purchase"
                    ? "border border-cyan-400/30 bg-cyan-500/20 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">Purchase</span>
              </button>
              <button
                onClick={() => handlePageChange("expense")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === "expense"
                    ? "border border-emerald-400/30 bg-emerald-500/20 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FiDollarSign className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">Expenses</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="border-t border-white/10 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">Logout</span>
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-h-0 overflow-auto pb-24 md:pb-0">
            {renderPage()}
          </div>

          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-xl md:hidden">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all ${
                      active ? item.activeClass : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-slate-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} toast={toast} />
      )}
    </>
  );
}

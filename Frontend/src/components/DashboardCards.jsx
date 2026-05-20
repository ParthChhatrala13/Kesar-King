import React from "react";
import { FiUsers, FiDollarSign, FiClock, FiTruck, FiLayers, FiTrendingUp, FiShoppingCart } from "react-icons/fi";

function getPurchaseCost(purchase) {
  return Number(
    purchase.total_cost ?? ((purchase.total_box || 0) * (purchase.price || 0) + (purchase.transportation_charge || 0))
  );
}

function computeStats(records, purchases, expenses, loadingPurchases, loadingExpenses) {
  const totalCustomers = records.length;
  const totalPayments = records.reduce((sum, r) => sum + (r.total_payment || 0), 0);
  const pendingPayments = records.filter((r) => !r.payment_status).length;
  const pendingDelivery = records.filter((r) => !r.delivery_status).length;
  const deliveredOrders = records.filter((r) => r.delivery_status).length;
  const totalPurchaseCost = purchases.reduce((sum, p) => sum + getPurchaseCost(p), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalBoxesFromPurchases = purchases.reduce((sum, p) => sum + Number(p.total_box || 0), 0);
  const totalBoxes = loadingPurchases && purchases.length === 0 ? null : totalBoxesFromPurchases;
  const soldBoxes = records.reduce((sum, r) => sum + (r.delivery_status ? Number(r.box || 0) : 0), 0);
  const remainingBoxes = totalBoxes === null ? null : Math.max(totalBoxes - soldBoxes, 0);
  const netProfit =
    (loadingPurchases && purchases.length === 0) || (loadingExpenses && expenses.length === 0)
      ? null
      : totalPayments - totalPurchaseCost - totalExpenses;

  return {
    totalCustomers,
    totalPayments,
    pendingPayments,
    pendingDelivery,
    deliveredOrders,
    totalBoxes,
    soldBoxes,
    remainingBoxes,
    totalPurchaseCost,
    totalExpenses,
    netProfit,
  };
}

function StatCard({ icon, label, value, accent, glow }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 ${glow}`}
    >
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`} />
      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]`}>
          {icon}
        </div>
        <div className="mt-4 text-3xl font-display font-extrabold leading-none text-white">
          {value}
        </div>
        <div className="mt-1 text-sm font-bold tracking-wide text-slate-300">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function DashboardCards({
  records = [],
  purchases = [],
  expenses = [],
  loadingPurchases = false,
  loadingExpenses = false,
}) {
  const stats = computeStats(records, purchases, expenses, loadingPurchases, loadingExpenses);
  const soldPercent = stats.totalBoxes > 0 ? Math.round((stats.soldBoxes / stats.totalBoxes) * 100) : 0;
  const profitNegative = stats.netProfit !== null && stats.netProfit < 0;
  const profitLabel =
    stats.netProfit === null ? "Loading..." : `Rs. ${stats.netProfit.toLocaleString("en-IN")}`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950 via-black to-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:col-span-2 xl:col-span-4 animate-fadeIn">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-2xl" />
        <div className="absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-cyan-500/10 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-amber-200">
              <FiLayers className="w-3.5 h-3.5" />
              Business Overview
            </div>
            <h3 className="mt-4 text-5xl sm:text-6xl font-display font-extrabold leading-none tracking-tight text-white">
              {stats.totalBoxes === null ? "--" : stats.totalBoxes.toLocaleString("en-IN")}
            </h3>
            <p className="mt-2 max-w-2xl text-sm sm:text-base font-medium text-slate-300">
              Revenue, purchases, expenses, and net profit are tracked together in one clean summary.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300 sm:flex-nowrap sm:text-[11px] sm:tracking-[0.16em]">
              <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-2 sm:px-3">
                <FiDollarSign className="h-3.5 w-3.5 text-emerald-300" />
                Revenue {stats.totalPayments.toLocaleString("en-IN")}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-2 sm:px-3">
                <FiShoppingCart className="h-3.5 w-3.5 text-cyan-300" />
                Cost {(stats.totalPurchaseCost + stats.totalExpenses).toLocaleString("en-IN")}
              </span>
              <span
                className={`inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 sm:px-3 ${
                  profitNegative
                    ? "border border-rose-400/20 bg-rose-500/10 text-rose-200"
                    : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                <FiTrendingUp className="h-3.5 w-3.5" />
                Profit {profitLabel === "Loading..." ? "Loading..." : profitLabel.replace(/^Rs\. /, "")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">Sold</div>
              <div className="mt-2 text-3xl font-display font-extrabold text-white">
                {stats.soldBoxes.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-sm font-medium text-emerald-100/70">Boxes delivered</div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">Remaining</div>
              <div className="mt-2 text-3xl font-display font-extrabold text-white">
                {stats.remainingBoxes === null ? "--" : stats.remainingBoxes.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-sm font-medium text-cyan-100/70">Still pending</div>
            </div>
          </div>
        </div>

        {stats.totalBoxes !== null ? (
          <div className="relative mt-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 transition-all duration-500"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>{soldPercent}% sold</span>
              <span>{stats.totalBoxes.toLocaleString("en-IN")} total boxes</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-xs font-semibold text-slate-400">Loading purchase totals...</div>
        )}
      </div>

      <StatCard
        icon={<FiUsers className="w-6 h-6" />}
        label="Total Customers"
        value={stats.totalCustomers.toLocaleString("en-IN")}
        accent="from-violet-500 to-fuchsia-500"
        glow="shadow-[0_0_0_1px_rgba(168,85,247,0.08)]"
      />
      <StatCard
        icon={<FiDollarSign className="w-6 h-6" />}
        label="Total Payments"
        value={`Rs. ${stats.totalPayments.toLocaleString("en-IN")}`}
        accent="from-emerald-500 to-teal-500"
        glow="shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
      />
      <StatCard
        icon={<FiClock className="w-6 h-6" />}
        label="Pending Payments"
        value={stats.pendingPayments.toLocaleString("en-IN")}
        accent="from-rose-500 to-pink-500"
        glow="shadow-[0_0_0_1px_rgba(244,63,94,0.08)]"
      />
      <StatCard
        icon={<FiTruck className="w-6 h-6" />}
        label="Pending Delivery"
        value={stats.pendingDelivery.toLocaleString("en-IN")}
        accent="from-sky-500 to-indigo-500"
        glow="shadow-[0_0_0_1px_rgba(14,165,233,0.08)]"
      />
    </div>
  );
}

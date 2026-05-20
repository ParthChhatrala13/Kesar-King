import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiRefreshCw, FiDownload, FiTrash2 } from "react-icons/fi";
import {
  getAllExpensesApi,
  createExpenseApi,
  deleteExpenseApi,
  downloadExpenseExcel,
} from "../api/purchaseApi";
import { SkeletonRow, EmptyState, MobileRecordSkeleton } from "../components/LoadingSpinner";

export default function OtherExpensePage({ onLogout, toast }) {
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getAllExpensesApi();
      const expenses = Array.isArray(res.data) ? res.data : [];
      setDisplayed(expenses);
      setApiAvailable(true);
    } catch (err) {
      setDisplayed([]);
      setApiAvailable(false);
      if (!silent) {
        toast.error(err.message || "Failed to fetch expenses");
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.amount) {
      toast.error("Please fill description and amount");
      return;
    }

    setSubmitting(true);
    try {
      await createExpenseApi({
        text: formData.text.trim(),
        amount: parseInt(formData.amount, 10),
      });
      toast.success("Expense added");
      setFormData({ text: "", amount: "" });
      setShowForm(false);
      fetchData(true);
    } catch (err) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpense = displayed.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] p-4 md:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-orb -top-24 -right-20 h-96 w-96 bg-violet-500/22" />
        <div className="aurora-orb top-32 -left-20 h-80 w-80 bg-fuchsia-500/18" />
        <div className="aurora-orb bottom-[-120px] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 bg-cyan-500/12" />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-display font-bold text-white">Other Expenses</h1>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button onClick={() => fetchData(true)} className="rounded-lg p-2 transition-all hover:bg-white/10">
                <FiRefreshCw className="h-5 w-5 text-amber-400" />
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await downloadExpenseExcel();
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "Expenses.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    toast.success("Downloaded Expenses Excel");
                  } catch {
                    toast.error("Download failed");
                  }
                }}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <FiDownload className="h-5 w-5 text-amber-300" />
              </button>
            </div>
          </div>
          <p className="font-body text-slate-400">Track standalone expenses with only description and amount.</p>
        </div>

        {!apiAvailable && (
          <div className="mb-6 rounded-2xl border border-amber-500/25 bg-white/5 px-4 py-3 text-sm text-slate-100">
            Backend not connected. Showing an empty expense list until the API is available.
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="panel-dark rounded-xl p-4">
            <p className="font-body text-xs uppercase tracking-wide text-slate-400">Total Expenses</p>
            <p className="mt-1 text-2xl font-bold text-amber-300">Rs. {totalExpense.toLocaleString("en-IN")}</p>
          </div>
          <div className="panel-dark rounded-xl p-4">
            <p className="font-body text-xs uppercase tracking-wide text-slate-400">Records</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{displayed.length}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="panel-dark group rounded-xl p-4 transition-all hover:bg-amber-500/20"
          >
            <FiPlus className="mx-auto mb-1 h-6 w-6 text-amber-400 group-hover:text-amber-300" />
            <p className="font-body text-xs font-semibold text-amber-400">Add Expense</p>
          </button>
        </div>

        {showForm && (
          <div className="panel-dark mb-6 rounded-xl p-6">
            <h2 className="mb-4 text-lg font-bold text-white">New Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input
                type="text"
                placeholder="Expense Description"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-white placeholder-slate-500"
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-white placeholder-slate-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Add Expense"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ text: "", amount: "" });
                  }}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-semibold text-white hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="panel-dark overflow-hidden rounded-xl">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3].map((i) => (
                  <SkeletonRow key={i} cols={4} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="block space-y-4 p-4 md:hidden">
            {[1, 2].map((i) => (
              <MobileRecordSkeleton key={i} />
            ))}
          </div>
        </div>
        ) : displayed.length === 0 ? (
          <EmptyState message="No expenses yet. Add one to get started!" />
        ) : (
          <div className="panel-dark overflow-hidden rounded-xl">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayed.map((expense) => {
                    const dateStr = expense.created_at
                      ? new Date(expense.created_at).toLocaleDateString("en-IN")
                      : "N/A";

                    return (
                      <tr key={expense.id} className="transition-colors hover:bg-white/5">
                        <td className="px-6 py-4 text-sm font-medium text-white">{expense.text}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-emerald-300">
                          Rs. {(Number(expense.amount) || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{dateStr}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={async () => {
                              if (!window.confirm("Delete this expense?")) return;
                              setDeletingExpense(expense.id);
                              try {
                                await deleteExpenseApi(expense.id);
                                toast.success("Deleted");
                                fetchData(true);
                              } catch {
                                toast.error("Delete failed");
                              }
                              setDeletingExpense(null);
                            }}
                            disabled={deletingExpense === expense.id}
                            className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 ring-1 ring-red-400/20 hover:bg-red-500/20 disabled:opacity-60"
                          >
                            <FiTrash2 className="h-4 w-4" />
                            {deletingExpense === expense.id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="block space-y-4 p-4 md:hidden">
              {displayed.map((expense) => {
                const dateStr = expense.created_at
                  ? new Date(expense.created_at).toLocaleDateString("en-IN")
                  : "N/A";

                return (
                  <div key={expense.id} className="rounded-lg border border-white/5 bg-slate-800/30 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="font-semibold text-white">{expense.text}</div>
                      <div className="font-bold text-emerald-300">
                        Rs. {(Number(expense.amount) || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">{dateStr}</div>
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this expense?")) return;
                          setDeletingExpense(expense.id);
                          try {
                            await deleteExpenseApi(expense.id);
                            toast.success("Deleted");
                            fetchData(true);
                          } catch {
                            toast.error("Delete failed");
                          }
                          setDeletingExpense(null);
                        }}
                        disabled={deletingExpense === expense.id}
                        className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 ring-1 ring-red-400/20 hover:bg-red-500/20 disabled:opacity-60"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        {deletingExpense === expense.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

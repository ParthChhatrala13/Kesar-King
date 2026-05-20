import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiX, FiSave, FiDownload } from "react-icons/fi";
import { getAllPurchasesApi, createPurchaseApi, updatePurchaseApi, deletePurchaseApi, downloadPurchaseExcel } from "../api/purchaseApi";
import { InlineSpinner, SkeletonRow, EmptyState, MobileRecordSkeleton } from "../components/LoadingSpinner";

function getCost(purchase) {
  return Number(purchase.total_cost ?? ((purchase.total_box || 0) * (purchase.price || 0) + (purchase.transportation_charge || 0)));
}

function normalizePurchases(data) {
  return Array.isArray(data) ? data : [];
}

function PurchaseEditor({ purchase, onClose, onSave, toast }) {
  const [form, setForm] = useState({
    total_box: String(purchase.total_box ?? ""),
    price: String(purchase.price ?? ""),
    transportation_charge: String(purchase.transportation_charge ?? ""),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.total_box || !form.price) {
      toast.error("Please fill total boxes and price");
      return;
    }

    setLoading(true);
    try {
      await updatePurchaseApi(purchase.id, {
        total_box: parseInt(form.total_box, 10),
        price: parseInt(form.price, 10),
        transportation_charge: parseInt(form.transportation_charge || 0, 10),
      });
      toast.success("Purchase updated");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md animate-fadeIn sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-3xl border border-white/10 bg-[#0b0b0c] shadow-2xl animate-popIn sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <h3 className="font-display text-lg font-extrabold text-white">Update Purchase</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Total Boxes</label>
              <input
                type="number"
                min="1"
                value={form.total_box}
                onChange={(e) => setForm((prev) => ({ ...prev, total_box: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-violet-400/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Price Per Box</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-violet-400/60"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Transportation Charge</label>
              <input
                type="number"
                min="0"
                value={form.transportation_charge}
                onChange={(e) => setForm((prev) => ({ ...prev, transportation_charge: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-violet-400/60"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? <InlineSpinner size={18} /> : <FiSave className="h-4 w-4" />}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ purchase, onClose, onDelete, toast }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(purchase.id);
      toast.success("Purchase deleted");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0b0c] p-6 text-center shadow-2xl animate-popIn">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-400/20">
          <FiTrash2 className="h-7 w-7 text-rose-400" />
        </div>
        <h3 className="mb-1 font-display text-lg font-extrabold text-white">Delete Purchase?</h3>
        <p className="mb-6 text-sm font-body text-slate-300">
          This purchase record will be removed permanently.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PurchaseCard({ purchase, index, onEdit, onDelete }) {
  const totalCost = getCost(purchase);
  const dateStr = purchase.created_at ? new Date(purchase.created_at).toLocaleDateString("en-IN") : "N/A";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">Purchase #{index + 1}</p>
          <p className="mt-1 text-lg font-display font-extrabold text-white">{purchase.total_box} Boxes</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{dateStr}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-extrabold text-emerald-300">Rs. {totalCost.toLocaleString("en-IN")}</p>
          <p className="text-xs font-medium text-slate-400">Total Cost</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Transport</div>
          <div className="mt-1 font-semibold text-white">Rs. {(purchase.transportation_charge || 0).toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Boxes</div>
          <div className="mt-1 font-semibold text-white">{purchase.total_box}</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onEdit(purchase)}
          className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-300 ring-1 ring-violet-400/20 hover:bg-violet-500/20"
        >
          <FiEdit2 className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(purchase)}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/20"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default function PurchasePage({ onLogout, toast }) {
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    total_box: "",
    price: "",
    transportation_charge: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [deletingPurchase, setDeletingPurchase] = useState(null);

  const fetchPurchases = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getAllPurchasesApi();
      const purchases = normalizePurchases(res.data);
      setDisplayed(purchases);
      setApiAvailable(true);
    } catch (err) {
      setDisplayed([]);
      setApiAvailable(false);
      if (!silent) {
        toast.error(err.message || "Failed to fetch purchases");
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    if (!formData.total_box || !formData.price) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await createPurchaseApi({
        total_box: parseInt(formData.total_box, 10),
        price: parseInt(formData.price, 10),
        transportation_charge: parseInt(formData.transportation_charge || 0, 10),
      });
      toast.success("Purchase record created");
      setFormData({ total_box: "", price: "", transportation_charge: "" });
      setShowForm(false);
      fetchPurchases(true);
    } catch (err) {
      toast.error(err.message || "Failed to create purchase");
    } finally {
      setSubmitting(false);
    }
  };

  const totalBoxes = displayed.reduce((sum, p) => sum + (p.total_box || 0), 0);
  const totalCost = displayed.reduce((sum, p) => sum + getCost(p), 0);

  const handleDeletePurchase = async (purchaseId) => {
    await deletePurchaseApi(purchaseId);
    fetchPurchases(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-6">
      <div className="mx-auto max-w-screen-xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white">Purchase Records</h1>
            <p className="mt-1 text-slate-400 font-body">Track total cost, update records, and delete purchases.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={async () => {
                try {
                  const res = await downloadPurchaseExcel();
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "Purchase_Records.xlsx");
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                  toast.success("Downloaded Purchase Excel");
                } catch {
                  toast.error("Download failed");
                }
              }}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 hover:bg-white/10"
              title="Download Purchase Excel"
            >
              <FiDownload className="h-5 w-5 text-cyan-300" />
            </button>
            <button
              onClick={() => fetchPurchases(true)}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 hover:bg-white/10"
              title="Refresh purchases"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!apiAvailable && (
          <div className="rounded-2xl border border-violet-500/25 bg-white/5 px-4 py-3 text-sm text-slate-100">
            Backend not connected. Showing an empty purchase list until the API is available.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 font-body">Total Boxes</p>
            <p className="mt-1 text-2xl font-display font-extrabold text-white">{totalBoxes}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 font-body">Total Cost</p>
            <p className="mt-1 text-2xl font-display font-extrabold text-emerald-300">Rs. {totalCost.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 font-body">Records</p>
            <p className="mt-1 text-2xl font-display font-extrabold text-violet-300">{displayed.length}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-4 text-left shadow-lg backdrop-blur-md hover:bg-white/10"
          >
            <FiPlus className="mb-2 h-6 w-6 text-violet-300" />
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200 font-body">Add Purchase</p>
          </button>
        </div>

        {showForm && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md">
            <h2 className="mb-4 text-lg font-display font-extrabold text-white">New Purchase</h2>
            <form onSubmit={handleAddPurchase} className="space-y-4">
              <input
                type="number"
                placeholder="Total Boxes"
                value={formData.total_box}
                onChange={(e) => setFormData({ ...formData, total_box: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60"
              />
              <input
                type="number"
                placeholder="Price Per Box"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60"
              />
              <input
                type="number"
                placeholder="Transportation Charge (optional)"
                value={formData.transportation_charge}
                onChange={(e) => setFormData({ ...formData, transportation_charge: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/60"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ total_box: "", price: "", transportation_charge: "" });
                  }}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Boxes</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Transport</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[1, 2, 3].map((i) => <SkeletonRow key={i} cols={5} />)}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 md:hidden">
              {[1, 2].map((i) => <MobileRecordSkeleton key={i} />)}
            </div>
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState message="No purchases yet. Create one to get started!" />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Boxes</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Transport</th>
                    <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {displayed.map((purchase) => {
                    const totalCost = getCost(purchase);
                    const dateStr = purchase.created_at
                      ? new Date(purchase.created_at).toLocaleDateString("en-IN")
                      : "N/A";

                    return (
                      <tr key={purchase.id} className="hover:bg-white/5 transition-colors align-top">
                        <td className="px-6 py-4 text-sm font-bold text-white">{purchase.total_box}</td>
                        <td className="px-6 py-4 text-sm font-display font-extrabold text-emerald-300">
                          Rs. {totalCost.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-300">
                          Rs. {(purchase.transportation_charge || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{dateStr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingPurchase(purchase)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-300 ring-1 ring-violet-400/20 hover:bg-violet-500/20"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingPurchase(purchase)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/20"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {displayed.map((purchase, idx) => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  index={idx}
                  onEdit={setEditingPurchase}
                  onDelete={setDeletingPurchase}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {editingPurchase ? (
        <PurchaseEditor
          purchase={editingPurchase}
          onClose={() => setEditingPurchase(null)}
          onSave={() => fetchPurchases(true)}
          toast={toast}
        />
      ) : null}

      {deletingPurchase ? (
        <DeleteConfirm
          purchase={deletingPurchase}
          onClose={() => setDeletingPurchase(null)}
          onDelete={handleDeletePurchase}
          toast={toast}
        />
      ) : null}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiUser, FiPhone, FiMapPin, FiBox, FiTag } from "react-icons/fi";
import { createRecordApi, deleteRecordApi } from "../api/mangoApi";
import { InlineSpinner } from "./LoadingSpinner";

function Field({ label, icon, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 font-body">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">{icon}</span>
        <input
          {...props}
          className="
            w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-2.5 pl-9
            text-sm font-semibold text-white transition-all
            focus:border-violet-400/70 focus:outline-none
          "
        />
      </div>
    </div>
  );
}

export default function EditModal({ record, onClose, onSaved, toast }) {
  const [form, setForm] = useState({
    name: record.name,
    contact_number: record.contact_number,
    city: record.city,
    box: String(record.box),
    price: String(record.price),
  });
  const [loading, setLoading] = useState(false);

  const totalPayment = (parseInt(form.box, 10) || 0) * (parseInt(form.price, 10) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.contact_number || !form.city || !form.box || !form.price) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await deleteRecordApi(record.id);
      await createRecordApi({
        name: form.name.trim(),
        contact_number: form.contact_number.trim(),
        city: form.city.trim(),
        box: parseInt(form.box, 10),
        price: parseInt(form.price, 10),
      });
      toast.success(`Record updated for ${form.name}`);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md animate-fadeIn sm:items-center sm:p-4">
      <div className="flex w-full max-w-lg max-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-black to-slate-900 shadow-2xl animate-popIn sm:max-h-[calc(100vh-2rem)] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h3 className="font-display font-extrabold text-white">Edit Record</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Customer Name" icon={<FiUser className="w-4 h-4" />} name="name" value={form.name} onChange={handleChange} placeholder="Customer name" />
            <Field label="Contact Number" icon={<FiPhone className="w-4 h-4" />} name="contact_number" value={form.contact_number} onChange={handleChange} placeholder="Phone" type="tel" />
            <Field label="City" icon={<FiMapPin className="w-4 h-4" />} name="city" value={form.city} onChange={handleChange} placeholder="City" />
            <Field label="Total Box" icon={<FiBox className="w-4 h-4" />} name="box" value={form.box} onChange={handleChange} placeholder="Boxes" type="number" min="1" />
            <Field label="Price Per Box (Rs.)" icon={<FiTag className="w-4 h-4" />} name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="1" />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 font-body">
                Total Payment (Auto)
              </label>
              <div className="flex min-h-[44px] items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 font-display text-base font-extrabold text-white">
                Rs. {totalPayment.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-slate-200 transition-all hover:bg-white/10 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="
              flex w-full items-center justify-center gap-2 rounded-2xl
              bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-2
              font-display text-sm font-extrabold text-white shadow-lg transition-all
              hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)] active:scale-95 disabled:opacity-60 sm:w-auto
            "
          >
            {loading ? <InlineSpinner size={16} /> : <FiSave className="w-4 h-4" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

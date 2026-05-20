import React, { useState } from "react";
import { FiUser, FiPhone, FiMapPin, FiBox, FiTag, FiSave, FiXCircle } from "react-icons/fi";
import { createRecordApi } from "../api/mangoApi";
import { InlineSpinner } from "./LoadingSpinner";

const BLANK = { name: "", contact_number: "", city: "", box: "", price: "" };

function Field({ label, icon, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 font-body">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
          {icon}
        </span>
        <input
          {...props}
          className={`
            w-full rounded-2xl border px-3 py-2.5 pl-9 text-sm font-semibold transition-all
            bg-black/60 text-white placeholder:text-slate-500
            ${error ? "border-rose-500/50 bg-rose-500/10" : "border-white/10 hover:border-violet-400/40 focus:border-violet-400/70"}
          `}
        />
      </div>
      {error ? <span className="text-xs text-rose-400 font-body">{error}</span> : null}
    </div>
  );
}

export default function AddRecordForm({ onRecordAdded, toast }) {
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const totalPayment = form.box && form.price
    ? parseInt(form.box, 10) * parseInt(form.price, 10)
    : 0;

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Customer name is required";
    if (!form.contact_number.trim()) nextErrors.contact_number = "Contact number is required";
    if (!/^\d{10,13}$/.test(form.contact_number.trim().replace(/\D/g, ""))) {
      nextErrors.contact_number = "Enter a valid phone number";
    }
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.box || form.box <= 0) nextErrors.box = "Box count must be greater than 0";
    if (!form.price || form.price <= 0) nextErrors.price = "Price must be greater than 0";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleClear = () => {
    setForm(BLANK);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createRecordApi({
        name: form.name.trim(),
        contact_number: form.contact_number.trim(),
        city: form.city.trim(),
        box: parseInt(form.box, 10),
        price: parseInt(form.price, 10),
      });
      toast.success(`Record for ${form.name} added!`);
      handleClear();
      onRecordAdded();
    } catch (err) {
      toast.error(err.message || "Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-md animate-fadeIn">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-lg text-white shadow-md">
            🥭
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-extrabold text-white">
              Add New Record
            </h2>
            <p className="text-xs font-medium text-slate-400 font-body">
              Fill customer delivery details
            </p>
          </div>
        </div>
        <span className={`text-violet-300 transition-transform duration-200 text-xl ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-6 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Customer Name"
              icon={<FiUser className="w-4 h-4" />}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Patel"
              error={errors.name}
            />
            <Field
              label="Contact Number"
              icon={<FiPhone className="w-4 h-4" />}
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              error={errors.contact_number}
              type="tel"
            />
            <Field
              label="City"
              icon={<FiMapPin className="w-4 h-4" />}
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Ahmedabad"
              error={errors.city}
            />
            <Field
              label="Total Box"
              icon={<FiBox className="w-4 h-4" />}
              name="box"
              value={form.box}
              onChange={handleChange}
              placeholder="e.g. 5"
              error={errors.box}
              type="number"
              min="1"
            />
            <Field
              label="Price Per Box (Rs.)"
              icon={<FiTag className="w-4 h-4" />}
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 800"
              error={errors.price}
              type="number"
              min="1"
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 font-body">
                Total Payment (Auto)
              </label>
              <div className="flex min-h-[44px] items-center rounded-2xl border border-dashed border-violet-400/30 bg-violet-500/10 px-4 py-2.5 font-display text-base font-extrabold text-white">
                Rs. {totalPayment.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="
                flex w-full items-center justify-center gap-2 rounded-2xl
                bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-2.5
                font-display text-sm font-extrabold text-white shadow-lg transition-all
                hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loading ? <InlineSpinner size={16} /> : <FiSave className="w-4 h-4" />}
              {loading ? "Saving..." : "Save Record"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="
                flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10
                bg-white/5 px-6 py-2.5 font-display text-sm font-extrabold text-slate-200
                transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 disabled:opacity-60
              "
            >
              <FiXCircle className="w-4 h-4" />
              Clear Form
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

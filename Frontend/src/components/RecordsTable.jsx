import React, { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { markPaymentDoneApi, markDeliveryDoneApi, deleteRecordApi } from "../api/mangoApi";
import { SkeletonRow, EmptyState, MobileRecordSkeleton } from "./LoadingSpinner";
import EditModal from "./EditModal";

function PaymentBadge({ done }) {
  return done ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
      <FiCheckCircle className="h-3 w-3" /> Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-300 ring-1 ring-rose-400/20">
      <FiClock className="h-3 w-3" /> Pending
    </span>
  );
}

function DeliveryBadge({ done }) {
  return done ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300 ring-1 ring-sky-400/20">
      <FiTruck className="h-3 w-3" /> Delivered
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/20">
      <FiPackage className="h-3 w-3" /> Pending
    </span>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b0b0c] p-6 text-center shadow-2xl animate-popIn">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-400/20">
          <FiAlertTriangle className="h-7 w-7 text-rose-400" />
        </div>
        <h3 className="mb-1 font-display text-lg font-extrabold text-white">Delete Record?</h3>
        <p className="mb-6 text-sm font-body text-slate-300">
          This will permanently delete the record for <strong>{name}</strong>. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-slate-200 transition-all hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-400 font-body ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`whitespace-nowrap px-4 py-3 text-sm font-body text-slate-200 ${className}`}>
      {children}
    </td>
  );
}

function ActionButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold font-body transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function RecordCard({ record, index, busy, onPayment, onDelivery, onEdit, onDelete }) {
  return (
    <div
      className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 animate-fadeIn"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p
              className="max-w-[14rem] font-display font-extrabold leading-5 text-white"
              style={{
                whiteSpace: "normal",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
              title={record.name}
            >
              {record.name}
            </p>
            <span className="flex-shrink-0 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-violet-300 ring-1 ring-violet-400/20">
              #{index + 1}
            </span>
          </div>
          <p className="mt-2 break-words text-xs font-medium text-slate-400 font-body">
            {record.contact_number} • {record.city}
          </p>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="font-display text-lg font-extrabold text-violet-300">
            Rs. {record.total_payment?.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] font-medium text-slate-400 font-body">
            Rs. {record.price?.toLocaleString("en-IN")} / box
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PaymentBadge done={record.payment_status} />
        <DeliveryBadge done={record.delivery_status} />
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/10">
          <FiPackage className="h-3 w-3" /> {record.box} boxes
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ActionButton
          onClick={() => onPayment(record)}
          disabled={!!busy || record.payment_status}
          className={
            record.payment_status
              ? "cursor-default bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"
              : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20 hover:-translate-y-0.5 hover:bg-emerald-500/20 hover:shadow-sm"
          }
        >
          <FiCheckCircle className="h-3.5 w-3.5" />
          {busy === "payment" ? "..." : "Paid"}
        </ActionButton>

        <ActionButton
          onClick={() => onDelivery(record)}
          disabled={!!busy || record.delivery_status}
          className={
            record.delivery_status
              ? "cursor-default bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20"
              : "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20 hover:-translate-y-0.5 hover:bg-sky-500/20 hover:shadow-sm"
          }
        >
          <FiTruck className="h-3.5 w-3.5" />
          {busy === "delivery" ? "..." : "Delivered"}
        </ActionButton>

        <ActionButton
          onClick={() => onEdit(record)}
          disabled={!!busy}
          className="bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/20 hover:-translate-y-0.5 hover:bg-violet-500/20 hover:shadow-sm disabled:opacity-50"
        >
          <FiEdit2 className="h-3.5 w-3.5" />
          Edit
        </ActionButton>

        <ActionButton
          onClick={() => onDelete(record)}
          disabled={!!busy}
          className="bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20 hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-sm disabled:opacity-50"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
          {busy === "delete" ? "..." : "Delete"}
        </ActionButton>
      </div>
    </div>
  );
}

export default function RecordsTable({ records, loading, onRefresh, toast, activeFilter = "all", onFilterSelect, filterOptions = [] }) {
  const [editRecord, setEditRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const setLoading = (id, state) => setActionLoading((prev) => ({ ...prev, [id]: state }));

  const handlePayment = async (record) => {
    if (record.payment_status) {
      toast.info("Payment already marked done");
      return;
    }
    setLoading(record.id, "payment");
    try {
      await markPaymentDoneApi(record.id);
      toast.success(`Payment done for ${record.name}`);
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to update payment");
    } finally {
      setLoading(record.id, null);
    }
  };

  const handleDelivery = async (record) => {
    if (record.delivery_status) {
      toast.info("Delivery already marked done");
      return;
    }
    setLoading(record.id, "delivery");
    try {
      await markDeliveryDoneApi(record.id);
      toast.success(`Delivery done for ${record.name}`);
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to update delivery");
    } finally {
      setLoading(record.id, null);
    }
  };

  const handleDeleteConfirm = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    setLoading(target.id, "delete");
    try {
      await deleteRecordApi(target.id);
      toast.success(`Record for ${target.name} deleted`);
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to delete record");
    } finally {
      setLoading(target.id, null);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c0f] to-[#060607] shadow-[0_24px_80px_rgba(0,0,0,0.55)] animate-fadeIn">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="font-display text-base font-extrabold tracking-wide text-white">Records</h2>
            <span className="ml-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-black text-violet-300 ring-1 ring-violet-400/20">
              {records.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {filterOptions.map((filter) => {
              const active = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterSelect?.(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-[0.16em] transition-all ${
                    active
                      ? filter.activeClass
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${filter.accent}`} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block table-scroll">
          <table className="w-full min-w-[840px]">
            <thead className="bg-white/5">
              <tr>
                <Th>#</Th>
                <Th>Customer</Th>
                <Th>Boxes</Th>
                <Th>Rs./Box</Th>
                <Th>Total Payment</Th>
                <Th>Payment</Th>
                <Th>Delivery</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading && records.length === 0
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                : null}

              {!loading && records.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState message="No mango records found" />
                  </td>
                </tr>
              ) : null}

              {records.map((record, idx) => {
                const busy = actionLoading[record.id];
                return (
                  <tr
                    key={record.id}
                    className="group align-top transition-colors duration-150 hover:bg-white/5"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <Td className="align-top font-black text-slate-400">{idx + 1}</Td>
                    <Td className="max-w-[260px] align-top">
                      <div className="space-y-1">
                        <div
                          className="font-display font-extrabold leading-5 text-white"
                          style={{
                            whiteSpace: "normal",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={record.name}
                        >
                          {record.name}
                        </div>
                        <div className="mt-1 text-xs leading-4 font-medium text-slate-400">
                          {record.contact_number} • {record.city}
                        </div>
                      </div>
                    </Td>
                    <Td className="font-bold text-slate-200">{record.box}</Td>
                    <Td className="font-semibold text-slate-300">Rs. {record.price?.toLocaleString("en-IN")}</Td>
                    <Td className="font-display font-extrabold text-violet-300">
                      Rs. {record.total_payment?.toLocaleString("en-IN")}
                    </Td>
                    <Td>
                      <PaymentBadge done={record.payment_status} />
                    </Td>
                    <Td>
                      <DeliveryBadge done={record.delivery_status} />
                    </Td>
                    <Td className="text-right align-top">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <ActionButton
                            onClick={() => handlePayment(record)}
                            disabled={!!busy || record.payment_status}
                            title="Mark Payment Done"
                            className={
                              record.payment_status
                                ? "cursor-default bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"
                                : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20 hover:-translate-y-0.5 hover:bg-emerald-500/20 hover:shadow-sm"
                            }
                          >
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            {busy === "payment" ? "..." : "Paid"}
                          </ActionButton>

                          <ActionButton
                            onClick={() => handleDelivery(record)}
                            disabled={!!busy || record.delivery_status}
                            title="Mark Delivery Done"
                            className={
                              record.delivery_status
                                ? "cursor-default bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20"
                                : "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20 hover:-translate-y-0.5 hover:bg-sky-500/20 hover:shadow-sm"
                            }
                          >
                            <FiTruck className="h-3.5 w-3.5" />
                            {busy === "delivery" ? "..." : "Delivered"}
                          </ActionButton>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <ActionButton
                            onClick={() => setEditRecord(record)}
                            disabled={!!busy}
                            title="Edit Record"
                            className="bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/20 hover:-translate-y-0.5 hover:bg-violet-500/20 hover:shadow-sm disabled:opacity-50"
                          >
                            <FiEdit2 className="h-3.5 w-3.5" />
                            Edit
                          </ActionButton>

                          <ActionButton
                            onClick={() => setDeleteTarget(record)}
                            disabled={!!busy}
                            title="Delete Record"
                            className="bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20 hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-sm disabled:opacity-50"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            {busy === "delete" ? "..." : "Delete"}
                          </ActionButton>
                        </div>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {loading && records.length === 0
            ? Array.from({ length: 4 }).map((_, i) => <MobileRecordSkeleton key={i} />)
            : null}

          {!loading && records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5">
              <EmptyState message="No mango records found" />
            </div>
          ) : null}

          {records.map((record, idx) => {
            const busy = actionLoading[record.id];
            return (
              <RecordCard
                key={record.id}
                record={record}
                index={idx}
                busy={busy}
                onPayment={handlePayment}
                onDelivery={handleDelivery}
                onEdit={setEditRecord}
                onDelete={setDeleteTarget}
              />
            );
          })}
        </div>

        {records.length > 0 ? (
          <div className="border-t border-white/10 px-4 py-3 text-xs font-body font-semibold text-slate-500 sm:px-6">
            Showing {records.length} record{records.length !== 1 ? "s" : ""}
          </div>
        ) : null}
      </div>

      {editRecord ? (
        <EditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSaved={onRefresh}
          toast={toast}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </>
  );
}




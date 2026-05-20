// ─── components/LoadingSpinner.jsx ───────────────────────────────────────────
// Reusable loading states — full-page spinner + inline spinner

import React from "react";

/* Full-page overlay spinner */
export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <MangoSpinner size={56} />
      <p className="mt-4 text-amber-300 font-display font-semibold tracking-wide text-sm animate-pulse">
        Loading…
      </p>
    </div>
  );
}

/* Inline spinner for buttons / table */
export function InlineSpinner({ size = 20, className = "" }) {
  return <MangoSpinner size={size} className={className} />;
}

/* Core SVG spinner ─ mango orange ring */
function MangoSpinner({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      className={`animate-spin ${className}`}
    >
      <circle cx="25" cy="25" r="20" stroke="#fde68a" strokeWidth="5" />
      <path
        d="M25 5 A20 20 0 0 1 45 25"
        stroke="#f59e0b"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Skeleton row for table loading */
export function SkeletonRow({ cols = 10 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function MobileRecordSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-card animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="skeleton h-9 rounded-xl" />
        <div className="skeleton h-9 rounded-xl" />
        <div className="skeleton h-9 rounded-xl" />
        <div className="skeleton h-9 rounded-xl" />
      </div>
    </div>
  );
}

/* Empty state illustration */
export function EmptyState({ message = "No records found", icon = "🥭" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
      <div className="text-6xl mb-4 select-none">{icon}</div>
      <p className="text-slate-300 font-body font-medium text-base">{message}</p>
      <p className="text-slate-500 text-sm mt-1">
        Add a new record using the form above.
      </p>
    </div>
  );
}

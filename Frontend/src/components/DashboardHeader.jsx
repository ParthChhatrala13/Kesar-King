import React from "react";
import { FiRefreshCw, FiDownload } from "react-icons/fi";
import { downloadMangoExcel } from "../api/purchaseApi";

export default function DashboardHeader({ onRefresh, refreshing, toast }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-2xl text-white shadow-[0_12px_30px_rgba(168,85,247,0.35)]">
            🥭
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-extrabold leading-tight text-white sm:text-lg">
              Parth Mango Records
            </h1>
            <p className="hidden truncate font-body text-xs font-medium text-slate-400 sm:block">
              Bold, clean record management dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh records"
            className="
              flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2
              text-sm font-bold font-body text-slate-200 transition-all
              hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white
              disabled:opacity-50
            "
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={async () => {
              try {
                const res = await downloadMangoExcel();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Mango_Records.xlsx");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                toast?.success("Downloaded Mango Excel");
              } catch {
                toast?.error("Download failed");
              }
            }}
            title="Download Mango Excel"
            className="
              flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2
              text-sm font-bold font-body text-slate-200 transition-all
              hover:border-cyan-400/40 hover:bg-cyan-500/15 hover:text-white
            "
          >
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}

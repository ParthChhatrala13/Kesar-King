import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchFilter({ search, onSearch }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 space-y-4 shadow-lg backdrop-blur-md animate-fadeIn">
      <div className="flex items-center gap-2 text-white">
        <span className="font-display text-sm font-extrabold tracking-wide">Quick Search</span>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by customer name..."
          className="
            w-full rounded-2xl border border-white/10 bg-black/60 py-3 pl-10 pr-10
            text-sm font-semibold text-white placeholder:text-slate-500
            transition-all focus:border-violet-400/60 focus:outline-none
          "
        />
        {search ? (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── pages/LoginPage.jsx ─────────────────────────────────────────────────────
// Login screen with secret-code input
// Calls POST /auth/login and GET /auth/forgot

import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { loginApi, forgotCodeApi } from "../api/mangoApi";
import { InlineSpinner } from "../components/LoadingSpinner";

export default function LoginPage({ onLogin, toast }) {
  // ── State ─────────────────────────────────────────────────────────────────
  const [code,      setCode]      = useState("");
  const [showCode,  setShowCode]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Submit login form */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!code.trim()) { toast.error("Please enter the secret code"); return; }
    setLoading(true);
    try {
      await loginApi(code.trim());
      toast.success("Welcome back, Parth! 🥭");
      onLogin();
    } catch (err) {
      toast.error(err.message || "Invalid secret code");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch forgot-code owner number */
  const handleForgot = async () => {
    try {
      const res = await forgotCodeApi();
      setForgotMsg(res.data.owner_number);
    } catch {
      // fall back to hardcoded number if API fails
      setForgotMsg("+919106467043");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] flex items-center justify-center p-4 sm:p-6">

      {/* Decorative blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-orb -top-28 -right-24 w-80 h-80 bg-amber-500/30" />
        <div className="aurora-orb top-20 -left-24 w-72 h-72 bg-sky-500/20" />
        <div className="aurora-orb bottom-[-96px] left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-emerald-500/10" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md animate-popIn">
        <div className="panel-dark rounded-3xl shadow-cardHover p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400 aurora-sheen" />

          {/* Logo / Emoji Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg mb-4 select-none">
              🥭
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight">
              Parth Mango Records
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-body">
              Personal Mango Record Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Secret Code Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5 font-body">
                Secret Code
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mango-400 w-4 h-4" />
                <input
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your secret code"
                  className="
                    w-full pl-10 pr-11 py-3 rounded-xl border dark-field
                    font-body transition-all
                  "
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCode ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl font-display font-semibold text-white text-base
                bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 aurora-sheen
                hover:from-amber-400 hover:to-orange-500
                active:scale-[.98] shadow-md hover:shadow-lg
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 transition-all
              "
            >
              {loading ? (
                <><InlineSpinner size={20} /> Logging in…</>
              ) : (
                "Login →"
              )}
            </button>
          </form>

          {/* Forgot Code */}
          <div className="mt-5 text-center">
            <button
              onClick={handleForgot}
              className="text-sm text-amber-400 hover:text-amber-300 font-semibold font-body underline-offset-2 hover:underline transition-colors"
            >
              Forgot Code?
            </button>

            {/* Owner contact reveal */}
            {forgotMsg && (
              <div className="mt-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 animate-fadeIn">
                <FiPhone className="text-amber-400 w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-200 font-body">
                  Contact Owner:&nbsp;
                  <a href={`tel:${forgotMsg}`} className="text-sky-400 hover:underline">
                    {forgotMsg}
                  </a>
                </span>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <p className="mt-6 text-center text-xs text-slate-500 font-body">
            Parth Mango Records &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

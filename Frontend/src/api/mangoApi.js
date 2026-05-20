// ─── api/mangoApi.js ─────────────────────────────────────────────────────────
// Centralized Axios API service for Parth Mango Records
// All calls go to FastAPI + Neo4j backend

import axios from "axios";

// ── Base URL ──────────────────────────────────────────────────────────────────
// Change this to your deployed backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Request interceptor (log requests in dev) ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor (normalise errors) ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ═════════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

/** POST /auth/login — verify secret code */
export const loginApi = (code) =>
  api.post("/auth/login", { code });

/** GET /auth/forgot — returns owner contact number */
export const forgotCodeApi = () =>
  api.get("/auth/forgot");

// ═════════════════════════════════════════════════════════════════════════════
// MANGO RECORD ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * POST /mango/
 * Create a new mango record.
 * @param {Object} data - { name, contact_number, city, box, price }
 */
export const createRecordApi = (data) =>
  api.post("/mango/", data);

/**
 * GET /mango/
 * Fetch all mango records.
 */
export const getAllRecordsApi = () =>
  api.get("/mango/");

/**
 * GET /mango/search/{name}
 * Search records by customer name.
 * @param {string} name
 */
export const searchRecordsApi = (name) =>
  api.get(`/mango/search/${encodeURIComponent(name)}`);

/**
 * GET /mango/pending
 * Get all records with pending payment.
 */
export const getPendingPaymentsApi = () =>
  api.get("/mango/pending");

/**
 * PUT /mango/payment/{id}
 * Mark payment as complete.
 * @param {string} id - UUID
 */
export const markPaymentDoneApi = (id) =>
  api.put(`/mango/payment/${id}`);

/**
 * PUT /mango/delivery/{id}
 * Mark delivery as complete.
 * @param {string} id - UUID
 */
export const markDeliveryDoneApi = (id) =>
  api.put(`/mango/delivery/${id}`);

/**
 * DELETE /mango/{id}
 * Delete a mango record.
 * @param {string} id - UUID
 */
export const deleteRecordApi = (id) =>
  api.delete(`/mango/${id}`);

export default api;

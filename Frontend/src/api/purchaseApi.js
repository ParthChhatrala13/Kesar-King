// ─── api/purchaseApi.js ──────────────────────────────────────────────────────
// API service for Purchase Records

import api from "./mangoApi";

// ═════════════════════════════════════════════════════════════════════════════
// PURCHASE ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * POST /purchase/
 * Create a new purchase record.
 * @param {Object} data - { total_box, price, transportation_charge }
 */
export const createPurchaseApi = (data) =>
  api.post("/purchase/", data);

/**
 * GET /purchase/
 * Fetch all purchase records.
 */
export const getAllPurchasesApi = () =>
  api.get("/purchase/");

/**
 * GET /purchase/{id}
 * Fetch a specific purchase record.
 */
export const getPurchaseApi = (id) =>
  api.get(`/purchase/${id}`);

/**
 * PUT /purchase/{id}
 * Update a purchase record.
 */
export const updatePurchaseApi = (id, data) =>
  api.put(`/purchase/${id}`, data);

/**
 * DELETE /purchase/{id}
 * Delete a purchase record.
 */
export const deletePurchaseApi = (id) =>
  api.delete(`/purchase/${id}`);

/**
 * GET /expense/{purchase_id}
 * Fetch all expenses for a specific purchase.
 * @param {string} purchase_id - Purchase UUID
 */
export const getExpensesByPurchaseApi = (purchaseId) =>
  api.get(`/expense/${purchaseId}`);

/**
 * GET /expense/
 * Fetch all expense records.
 */
export const getAllExpensesApi = () =>
  api.get("/expense/");

/**
 * POST /expense/
 * Add a standalone expense record.
 * @param {Object} data - { text, amount }
 */
export const createExpenseApi = (data) =>
  api.post("/expense/", data);

/**
 * GET /expense/detail/{id}
 * Get a specific expense.
 */
export const getExpenseApi = (id) =>
  api.get(`/expense/detail/${id}`);

/**
 * PUT /expense/{id}
 * Update an expense.
 */
export const updateExpenseApi = (id, data) =>
  api.put(`/expense/${id}`, data);

/**
 * DELETE /expense/{id}
 * Delete an expense.
 */
export const deleteExpenseApi = (id) =>
  api.delete(`/expense/${id}`);

/**
 * GET /download/mango/excel
 * Download mango records as Excel
 */
export const downloadMangoExcel = () =>
  api.get("/download/mango/excel", { responseType: "blob" });

/**
 * GET /download/mango/pdf
 * Download mango records as PDF
 */
export const downloadMangoPdf = () =>
  api.get("/download/mango/pdf", { responseType: "blob" });

/**
 * GET /download/purchase/excel
 * Download purchase records as Excel
 */
export const downloadPurchaseExcel = () =>
  api.get("/download/purchase/excel", { responseType: "blob" });

/**
 * GET /download/purchase/pdf
 * Download purchase records as PDF
 */
export const downloadPurchasePdf = () =>
  api.get("/download/purchase/pdf", { responseType: "blob" });

/**
 * GET /download/expense/excel
 * Download expense records as Excel
 */
export const downloadExpenseExcel = () =>
  api.get("/download/expense/excel", { responseType: "blob" });

/**
 * GET /download/expense/pdf
 * Download expense records as PDF
 */
export const downloadExpensePdf = () =>
  api.get("/download/expense/pdf", { responseType: "blob" });

export default api;

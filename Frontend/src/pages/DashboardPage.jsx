import React, { useState, useEffect, useCallback } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import AddRecordForm from "../components/AddRecordForm";
import SearchFilter from "../components/SearchFilter";
import RecordsTable from "../components/RecordsTable";
import { getAllRecordsApi, searchRecordsApi } from "../api/mangoApi";
import { getAllPurchasesApi, getAllExpensesApi } from "../api/purchaseApi";

export const DUMMY_RECORDS = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Rajesh Patel",
    contact_number: "9876543210",
    city: "Ahmedabad",
    box: 10,
    price: 800,
    total_payment: 8000,
    payment_status: true,
    delivery_status: true,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Sunita Shah",
    contact_number: "9123456780",
    city: "Surat",
    box: 5,
    price: 850,
    total_payment: 4250,
    payment_status: false,
    delivery_status: false,
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-012345678902",
    name: "Mahesh Desai",
    contact_number: "9234567891",
    city: "Vadodara",
    box: 8,
    price: 780,
    total_payment: 6240,
    payment_status: true,
    delivery_status: false,
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-123456789013",
    name: "Priya Mehta",
    contact_number: "9345678902",
    city: "Rajkot",
    box: 3,
    price: 900,
    total_payment: 2700,
    payment_status: false,
    delivery_status: false,
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-234567890124",
    name: "Kavita Joshi",
    contact_number: "9456789013",
    city: "Gandhinagar",
    box: 12,
    price: 750,
    total_payment: 9000,
    payment_status: true,
    delivery_status: true,
  },
];

function applyFilter(records, filter) {
  switch (filter) {
    case "pending_payment":
      return records.filter((r) => !r.payment_status);
    case "pending_delivery":
      return records.filter((r) => !r.delivery_status);
    case "delivered":
      return records.filter((r) => r.delivery_status);
    case "payment_done":
      return records.filter((r) => r.payment_status);
    default:
      return records;
  }
}

function getFilterCount(records, filter) {
  return applyFilter(records, filter).length;
}

const RECORD_FILTERS = [
  {
    id: "pending_payment",
    label: "Pending Payment",
    accent: "from-rose-500 to-pink-500",
    activeClass: "border-rose-400/30 bg-rose-500/15 text-rose-200",
  },
  {
    id: "pending_delivery",
    label: "Pending Delivery",
    accent: "from-sky-500 to-indigo-500",
    activeClass: "border-sky-400/30 bg-sky-500/15 text-sky-200",
  },
  {
    id: "delivered",
    label: "Delivered",
    accent: "from-emerald-500 to-teal-500",
    activeClass: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
  },
  {
    id: "payment_done",
    label: "Payment Done",
    accent: "from-violet-500 to-fuchsia-500",
    activeClass: "border-violet-400/30 bg-violet-500/15 text-violet-200",
  },
];

export default function DashboardPage({ onLogout, toast }) {
  const [allRecords, setAllRecords] = useState([]);
  const [allPurchases, setAllPurchases] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [apiAvailable, setApiAvailable] = useState(true);

  const fetchRecords = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await getAllRecordsApi();
        setAllRecords(res.data);
        setApiAvailable(true);
      } catch {
        if (process.env.NODE_ENV === "development") {
          setAllRecords(DUMMY_RECORDS);
          setApiAvailable(false);
          if (!silent) toast.info("Using demo data - backend not connected");
        } else {
          toast.error("Failed to fetch records");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast]
  );

  const fetchPurchases = useCallback(async () => {
    setPurchasesLoading(true);
    try {
      const res = await getAllPurchasesApi();
      setAllPurchases(res.data);
    } catch {
      if (process.env.NODE_ENV === "development") {
        setAllPurchases([]);
      }
    } finally {
      setPurchasesLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setExpensesLoading(true);
    try {
      const res = await getAllExpensesApi();
      setAllExpenses(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (process.env.NODE_ENV === "development") {
        setAllExpenses([]);
      }
    } finally {
      setExpensesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchPurchases();
    fetchExpenses();
  }, [fetchRecords, fetchPurchases, fetchExpenses]);

  const handleSearch = useCallback(
    async (value) => {
      setSearch(value);

      if (!value.trim()) {
        setDisplayed(applyFilter(allRecords, activeFilter));
        return;
      }

      const lower = value.toLowerCase();

      if (apiAvailable) {
        try {
          const res = await searchRecordsApi(value.trim());
          setDisplayed(applyFilter(res.data, activeFilter));
          return;
        } catch {
          setDisplayed(
            applyFilter(
              allRecords.filter((r) => r.name.toLowerCase().includes(lower)),
              activeFilter
            )
          );
          return;
        }
      }

      setDisplayed(
        applyFilter(
          allRecords.filter((r) => r.name.toLowerCase().includes(lower)),
          activeFilter
        )
      );
    },
    [allRecords, activeFilter, apiAvailable]
  );

  const handleFilter = useCallback(
    (filterId) => {
      const nextFilter = activeFilter === filterId ? "all" : filterId;
      setActiveFilter(nextFilter);
      const base = search
        ? allRecords.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
        : allRecords;
      setDisplayed(applyFilter(base, nextFilter));
    },
    [allRecords, search, activeFilter]
  );

  useEffect(() => {
    const base = search
      ? allRecords.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      : allRecords;
    setDisplayed(applyFilter(base, activeFilter));
  }, [allRecords, search, activeFilter]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-orb -top-24 -right-20 w-96 h-96 bg-violet-500/22" />
        <div className="aurora-orb top-32 -left-20 w-80 h-80 bg-fuchsia-500/18" />
        <div className="aurora-orb bottom-[-120px] left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-cyan-500/12" />
      </div>

      <DashboardHeader
        onRefresh={() => fetchRecords(true)}
        refreshing={refreshing}
        toast={toast}
      />

      <main className="relative z-10 mx-auto max-w-screen-xl space-y-4 px-4 py-5 pb-10 sm:px-6 sm:py-6 sm:space-y-5">
        {!apiAvailable && (
          <div className="animate-fadeIn flex items-center gap-2 rounded-2xl border border-violet-500/25 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-lg backdrop-blur-md">
            <span className="text-violet-400">!</span>
            <strong className="text-white">Demo mode:</strong>
            <span className="text-slate-300">Backend not connected. Showing sample data.</span>
          </div>
        )}

        <SearchFilter
          search={search}
          onSearch={handleSearch}
        />

        <DashboardCards
          records={allRecords}
          purchases={allPurchases}
          expenses={allExpenses}
          loadingPurchases={purchasesLoading}
          loadingExpenses={expensesLoading}
        />

        <AddRecordForm onRecordAdded={() => fetchRecords(true)} toast={toast} />

        <RecordsTable
          records={displayed}
          loading={loading}
          onRefresh={() => fetchRecords(true)}
          toast={toast}
          activeFilter={activeFilter}
          onFilterSelect={handleFilter}
          filterOptions={RECORD_FILTERS.map((filter) => ({
            ...filter,
            count: getFilterCount(allRecords, filter.id),
          }))}
        />
      </main>

      <footer className="relative z-10 py-6 text-center text-xs font-body text-slate-500">
        Parth Mango Records &copy; {new Date().getFullYear()} - Built for a cleaner mango season
      </footer>
    </div>
  );
}

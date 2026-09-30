import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

import AppNavbar from "../../components/AppNavbar";
const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  dispatched: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNavbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F59E0B]">
            Workshop shop
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#082F49] sm:text-4xl">
            My orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            View your workshop purchases and follow their status.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders onShop={() => navigate("/customer/shop")} />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#082F49]">
                        Order #{order.id}
                      </p>

                      <StatusBadge status={order.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {formatOrderDate(order.created_at)}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                    <div className="sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#082F49]">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/customer/orders/${order.id}`)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F3D5E] transition hover:border-[#0F3D5E] hover:bg-slate-50"
                    >
                      View order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyOrders({ onShop }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F3D5E] text-2xl font-bold text-[#FBBF24]">
        #
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#082F49]">
        No orders yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Your workshop purchases will appear here after you complete checkout.
      </p>

      <button
        type="button"
        onClick={onShop}
        className="mt-6 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#082F49] transition hover:bg-[#FBBF24]"
      >
        Browse workshop shop
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

function formatPrice(price) {
  const amount = Number(price);

  if (Number.isNaN(amount)) {
    return price;
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatOrderDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

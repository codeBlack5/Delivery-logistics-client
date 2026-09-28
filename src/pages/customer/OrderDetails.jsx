import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

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

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load this order.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader
        onOrders={() => navigate("/customer/orders")}
        onShop={() => navigate("/customer/shop")}
        onDashboard={() => navigate("/customer")}
      />

      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading order...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/customer/orders")}
              className="mt-4 rounded-lg bg-[#0F3D5E] px-4 py-2 text-sm font-semibold text-white"
            >
              Back to orders
            </button>
          </div>
        ) : order ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/customer/orders")}
              className="mb-5 text-sm font-semibold text-[#0F3D5E] hover:text-[#082F49]"
            >
              ← Back to my orders
            </button>

            <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-lg">
              <div className="px-6 py-7 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                      Workshop order
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                      Order #{order.id}
                    </h1>

                    <p className="mt-2 text-sm text-blue-100/80">
                      Placed {formatOrderDate(order.created_at)}
                    </p>
                  </div>

                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                  <p className="text-sm font-semibold text-[#F59E0B]">
                    Items
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                    Order items
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items?.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#082F49]">
                          {item.product_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatPrice(item.unit_price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-lg font-bold text-[#082F49]">
                        {formatPrice(item.line_total)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
                  Summary
                </p>

                <div className="mt-5 space-y-4">
                  <SummaryRow
                    label="Status"
                    value={statusLabels[order.status] || order.status}
                  />

                  <SummaryRow
                    label="Items"
                    value={`${order.items?.length || 0}`}
                  />

                  <SummaryRow
                    label="Delivery"
                    value={
                      order.delivery_id
                        ? `DL-${order.delivery_id}`
                        : "Not assigned"
                    }
                  />

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-600">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-[#082F49]">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/customer/shop")}
                  className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0F3D5E] transition hover:border-[#0F3D5E] hover:bg-slate-50"
                >
                  Continue shopping
                </button>
              </aside>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-[#082F49]">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

function PageHeader({ onOrders, onShop, onDashboard }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] font-bold text-[#082F49] shadow-sm">
            DL
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-[#082F49]">
              Delivery Logistics
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Workshop shop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOrders}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
          >
            Orders
          </button>

          <button
            type="button"
            onClick={onShop}
            className="hidden rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E] sm:block"
          >
            Shop
          </button>

          <button
            type="button"
            onClick={onDashboard}
            className="rounded-lg bg-[#0F3D5E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#082F49]"
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
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

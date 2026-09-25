import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const deliveries = [
  {
    id: "DL-1001",
    recipient: "John Kamau",
    destination: "Nairobi CBD",
    type: "Standard",
    status: "in_transit",
    date: "Today",
  },
  {
    id: "DL-1000",
    recipient: "Mary Wanjiku",
    destination: "Westlands",
    type: "Express",
    status: "delivered",
    date: "Yesterday",
  },
  {
    id: "DL-0999",
    recipient: "Peter Kiptoo",
    destination: "Kilimani",
    type: "Standard",
    status: "accepted",
    date: "22 Sep 2026",
  },
];

const statusStyles = {
  requested: "bg-slate-100 text-slate-700",
  accepted: "bg-blue-50 text-blue-700",
  assigned: "bg-indigo-50 text-indigo-700",
  picked_up: "bg-amber-50 text-amber-700",
  in_transit: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels = {
  requested: "Requested",
  accepted: "Accepted",
  assigned: "Assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
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
                Customer workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-lg">
          <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#FBBF24]">
                  Customer workspace
                </p>

                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Welcome back{user?.name ? `, ${user.name}` : ""}.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                  Create deliveries, track your packages, and keep an eye on
                  your delivery history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/customer/deliveries/new")}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 focus:ring-offset-[#0F3D5E]"
              >
                + Create Delivery
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total deliveries" value="12" />
          <StatCard label="In transit" value="2" />
          <StatCard label="Delivered" value="9" />
          <StatCard label="Cancelled" value="1" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#F59E0B]">
                  Activity
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                  Recent deliveries
                </h2>
              </div>

              <button
                type="button"
                className="self-start text-sm font-semibold text-[#0F3D5E] hover:text-[#082F49]"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {deliveries.map((delivery) => (
                <article
                  key={delivery.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-800">
                        {delivery.id}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[delivery.status]
                        }`}
                      >
                        {statusLabels[delivery.status]}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      To {delivery.recipient} · {delivery.destination}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {delivery.type} · {delivery.date}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E] md:self-auto"
                  >
                    View
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold text-[#F59E0B]">Shortcuts</p>

            <h2 className="mt-1 text-xl font-bold text-[#082F49]">
              Quick actions
            </h2>

            <div className="mt-5 space-y-3">
              <QuickAction
                title="Create a delivery"
                description="Send a package"
                onClick={() => navigate("/customer/deliveries/new")}
                primary
              />

              <QuickAction
                title="Track delivery"
                description="Check current status"
                onClick={() => {}}
              />

              <QuickAction
                title="Delivery history"
                description="View past deliveries"
                onClick={() => {}}
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#082F49] sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function QuickAction({ title, description, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
        primary
          ? "border-[#F59E0B] bg-amber-50 hover:bg-amber-100"
          : "border-slate-200 bg-white hover:border-[#0F3D5E] hover:bg-slate-50"
      }`}
    >
      <span>
        <span className="block text-sm font-bold text-[#082F49]">
          {title}
        </span>

        <span className="mt-1 block text-xs text-slate-500">
          {description}
        </span>
      </span>

      <span className="text-lg text-[#0F3D5E]">→</span>
    </button>
  );
}

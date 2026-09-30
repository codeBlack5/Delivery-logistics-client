import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppNavbar from "../../components/AppNavbar";

const deliveries = [
  {
    id: "DL-1042",
    customer: "James Mwangi",
    pickup: "Karen",
    destination: "Westlands",
    type: "Express",
    status: "picked_up",
    fee: "KES 350",
    time: "10:30 AM",
  },
  {
    id: "DL-1041",
    customer: "Grace Wanjiru",
    pickup: "Kilimani",
    destination: "Nairobi CBD",
    type: "Standard",
    status: "in_transit",
    fee: "KES 250",
    time: "11:15 AM",
  },
  {
    id: "DL-1040",
    customer: "Brian Kiptoo",
    pickup: "Lavington",
    destination: "Parklands",
    type: "Standard",
    status: "assigned",
    fee: "KES 280",
    time: "1:00 PM",
  },
  {
    id: "DL-1039",
    customer: "Mercy Chebet",
    pickup: "Rongai",
    destination: "Karen",
    type: "Express",
    status: "delivered",
    fee: "KES 400",
    time: "Yesterday",
  },
];

const statusStyles = {
  assigned: "bg-indigo-50 text-indigo-700",
  picked_up: "bg-amber-50 text-amber-700",
  in_transit: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
};

const statusLabels = {
  assigned: "Assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
};

export default function RiderDashboard() {
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
      <AppNavbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-lg">
          <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#FBBF24]">
                  Rider workspace
                </p>

                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Ready for the road{user?.name ? `, ${user.name}` : ""}.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                  View your assigned deliveries, update delivery progress, and
                  keep customers informed.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.15)]" />

                <div>
                  <p className="text-xs text-blue-100/70">Current status</p>
                  <p className="text-sm font-bold text-white">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Today's deliveries" value="4" />
          <StatCard label="Active" value="2" />
          <StatCard label="Delivered" value="1" />
          <StatCard label="Today's fees" value="KES 1,280" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm font-semibold text-[#F59E0B]">
                  Delivery queue
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                  Your deliveries
                </h2>
              </div>

              <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F3D5E]">
                4 assigned
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {deliveries.map((delivery) => (
                <article
                  key={delivery.id}
                  className="px-5 py-5 sm:px-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                        {delivery.type === "Express" && (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                            Express
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {delivery.customer}
                      </p>

                      <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:gap-2">
                        <span>{delivery.pickup}</span>
                        <span className="hidden sm:inline">→</span>
                        <span>{delivery.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <div className="text-left md:text-right">
                        <p className="text-sm font-bold text-[#082F49]">
                          {delivery.fee}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {delivery.time}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg bg-[#0F3D5E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0F3D5E] focus:ring-offset-2"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold text-[#F59E0B]">
              Rider tools
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#082F49]">
              Quick actions
            </h2>

            <div className="mt-5 space-y-3">
              <QuickAction
                title="My deliveries"
                description="View assigned deliveries"
                primary
              />

              <QuickAction
                title="Delivery history"
                description="View completed deliveries"
              />

              <QuickAction
                title="My earnings"
                description="Review delivery fees"
              />
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Today's progress
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/4 rounded-full bg-[#F59E0B]" />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                1 of 4 deliveries completed
              </p>
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

      <p className="mt-2 break-words text-2xl font-bold text-[#082F49] sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function QuickAction({ title, description, primary = false }) {
  return (
    <button
      type="button"
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

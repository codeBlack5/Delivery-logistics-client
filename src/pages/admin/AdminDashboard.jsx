import AppNavbar from "../../components/AppNavbar";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppNavbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F59E0B]">
            Admin workspace
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#082F49] sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Manage and monitor the Steelo Logistics platform from one place.
          </p>
        </div>
      </section>
    </main>
  );
}

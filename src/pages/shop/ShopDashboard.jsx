import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import api from "../../api/client";

export default function ShopDashboard() {
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadShop() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/shop_management/shop");

        if (!cancelled) {
          setShop(response.data.shop);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ||
              "Unable to load your shop profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadShop();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
            Shop Management
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#082F49]">
            Shop Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your shop and the products you offer through Steelo
            Logistics.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Loading shop profile...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">
              Unable to load shop
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && shop && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#082F49]">
                    {shop.name}
                  </h2>

                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-bold",
                      shop.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {shop.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-slate-600">
                  {shop.description || "No shop description has been added yet."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Shop ID</p>
                <p className="mt-1">#{shop.id}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Address
                </p>
                <p className="mt-1 font-medium text-slate-700">
                  {shop.address || "No address provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Shop Owner
                </p>
                <p className="mt-1 font-medium text-slate-700">
                  {shop.owner?.name || "—"}
                </p>
                <p className="text-sm text-slate-500">
                  {shop.owner?.email || "—"}
                </p>
              </div>
            </div>
          </section>
        )}

        {!loading && !error && shop && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Products
              </p>
              <p className="mt-2 text-2xl font-bold text-[#082F49]">
                {shop.product_count ?? "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Manage the products offered by your shop.
              </p>

              <a
                href="/shop/products"
                className="mt-4 inline-flex rounded-lg bg-[#0F3D5E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#082F49]"
              >
                Manage Products
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-[#082F49]">—</p>
              <p className="mt-1 text-sm text-slate-500">
                Shop orders will be added later.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Delivery
              </p>
              <p className="mt-2 text-2xl font-bold text-[#082F49]">—</p>
              <p className="mt-1 text-sm text-slate-500">
                Delivery integration will follow.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

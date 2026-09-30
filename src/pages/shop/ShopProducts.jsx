import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import BackButton from "../../components/BackButton";
import api from "../../api/client";

export default function ShopProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/shop_management/products");

        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Failed to load shop products:", err);
        setError(
          err.response?.data?.error ||
            "Unable to load your shop products.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNavbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BackButton fallback="/shop" />

            <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
              Shop Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#082F49]">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Add and manage the products offered by your shop.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop/products/new")}
            className="rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24]"
          >
            + Add Product
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading your products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              No products yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first product to start selling through Steelo
              Logistics.
            </p>

            <button
              type="button"
              onClick={() => navigate("/shop/products/new")}
              className="mt-5 rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-bold text-white hover:bg-[#082F49]"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">
                      {product.category?.name || "Uncategorised"}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                      {product.name}
                    </h2>
                  </div>

                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      product.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-3 min-h-10 text-sm text-slate-500">
                  {product.description || "No description provided."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Price
                    </p>
                    <p className="mt-1 font-bold text-[#082F49]">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Stock
                    </p>
                    <p className="mt-1 font-bold text-[#082F49]">
                      {product.stock_quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/shop/products/${product.id}/edit`)
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  {product.active && (
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function Shop() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShop() {
      try {
        setLoading(true);
        setError("");

        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get("/shop/categories"),
          api.get("/shop/products"),
        ]);

        setCategories(categoriesResponse.data.categories || []);
        setProducts(productsResponse.data.products || []);
      } catch (err) {
        console.error("Failed to load shop:", err);
        setError(
          err.response?.data?.error ||
            "Unable to load the workshop catalogue.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, []);

  async function handleCategoryChange(categoryId) {
    setSelectedCategory(categoryId);

    try {
      setError("");

      const url = categoryId
        ? `/shop/products?category_id=${categoryId}`
        : "/shop/products";

      const response = await api.get(url);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to filter products:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load products for this category.",
      );
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
                Workshop shop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E] sm:px-4"
          >
            Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-lg">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />
            <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FBBF24]">
                Workshop shop
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Built in the workshop. Delivered to you.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
                Browse furniture, workshop products, and other items made
                available by our workshop.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#F59E0B]">Catalogue</p>
            <h2 className="mt-1 text-2xl font-bold text-[#082F49]">
              Workshop products
            </h2>
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-[#0F3D5E] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading workshop products...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load the catalogue.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              No products available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              There are currently no active products in this category.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-44 items-center justify-center bg-slate-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F3D5E] text-2xl font-bold text-[#FBBF24]">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">
                    {product.category?.name || "Workshop"}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[#082F49]">
                    {product.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">
                    {product.description || "Workshop-made product."}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xl font-bold text-[#082F49]">
                        {formatPrice(product.price)}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          product.stock_quantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock_quantity > 0
                          ? `${product.stock_quantity} in stock`
                          : "Out of stock"}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={product.stock_quantity <= 0}
                      onClick={() => navigate(`/customer/shop/${product.id}`)}
                      className="rounded-lg bg-[#F59E0B] px-3 py-2 text-sm font-bold text-[#082F49] transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      View
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

import AppNavbar from "../../components/AppNavbar";

export default function Shop() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    part_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    part_condition: "",
  });
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

  const initialFilters = {
    q: "",
    part_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    part_condition: "",
  };

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  async function handleClearFilters() {
    setFilters(initialFilters);
    setSelectedCategory("");

    try {
      setLoading(true);
      setError("");
      const response = await api.get("/shop/products");
      setProducts(response.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to reload the spare-parts catalogue.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (selectedCategory) params.set("category_id", selectedCategory);

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) params.set(key, value.trim());
      });

      const query = params.toString();
      const response = await api.get(
        `/shop/products${query ? `?${query}` : ""}`,
      );

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to search spare parts:", err);
      setError(
        err.response?.data?.error ||
          "Unable to search the spare-parts catalogue.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNavbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-lg">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />
            <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FBBF24]">
                Automotive spare parts
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                The right spare parts for your vehicle.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
                Browse automotive spare parts and find components compatible
                with your vehicle.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSearch}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#F59E0B]">Automotive catalogue</p>
            <h2 className="mt-1 text-2xl font-bold text-[#082F49]">
              Find the right spare part
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by part number, OEM reference, vehicle, or category.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Part name or OEM reference"
              aria-label="Search part name or OEM reference"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F3D5E] focus:ring-2 focus:ring-blue-100"
            />

            <input
              name="part_number"
              value={filters.part_number}
              onChange={handleFilterChange}
              placeholder="Part number"
              aria-label="Part number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F3D5E] focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              disabled={loading}
              aria-label="Category"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F3D5E] disabled:opacity-60"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              name="vehicle_make"
              value={filters.vehicle_make}
              onChange={handleFilterChange}
              placeholder="Vehicle make (e.g. Toyota)"
              aria-label="Vehicle make"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F3D5E]"
            />

            <input
              name="vehicle_model"
              value={filters.vehicle_model}
              onChange={handleFilterChange}
              placeholder="Vehicle model (e.g. Corolla)"
              aria-label="Vehicle model"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F3D5E]"
            />

            <input
              name="vehicle_year"
              type="number"
              min="1900"
              max="2100"
              value={filters.vehicle_year}
              onChange={handleFilterChange}
              placeholder="Vehicle year (e.g. 2018)"
              aria-label="Vehicle year"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0F3D5E]"
            />

            <select
              name="part_condition"
              value={filters.part_condition}
              onChange={handleFilterChange}
              aria-label="Part condition"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F3D5E]"
            >
              <option value="">Any condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-bold text-[#082F49] transition hover:bg-[#FBBF24] disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search spare parts"}
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        </form>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading spare parts...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load the spare-parts catalogue.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              No spare parts found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or clear some filters.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-52 items-center justify-center bg-slate-100 p-4">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F3D5E] text-2xl font-bold text-[#FBBF24]">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">
                    {product.category?.name || "Spare parts"}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[#082F49]">
                    {product.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">
                    {product.description || "Automotive spare part."}
                  </p>

                  {(product.part_number ||
                    product.oem_reference ||
                    product.vehicle_make ||
                    product.vehicle_model ||
                    product.year_from ||
                    product.year_to ||
                    product.part_condition) && (
                    <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                      {product.part_number && (
                        <p><span className="font-semibold text-slate-800">Part no.:</span>{" "}{product.part_number}</p>
                      )}
                      {product.oem_reference && (
                        <p><span className="font-semibold text-slate-800">OEM:</span>{" "}{product.oem_reference}</p>
                      )}
                      {(product.vehicle_make || product.vehicle_model) && (
                        <p><span className="font-semibold text-slate-800">Fits:</span>{" "}{[product.vehicle_make, product.vehicle_model].filter(Boolean).join(" ")}</p>
                      )}
                      {(product.year_from || product.year_to) && (
                        <p><span className="font-semibold text-slate-800">Years:</span>{" "}{product.year_from || "Not specified"} – {product.year_to || "Not specified"}</p>
                      )}
                      {product.part_condition && (
                        <p><span className="font-semibold text-slate-800">Condition:</span>{" "}{product.part_condition.charAt(0).toUpperCase() + product.part_condition.slice(1)}</p>
                      )}
                    </div>
                  )}

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
                      onClick={() =>
                        navigate(`/customer/shop/${product.id}`)
                      }
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
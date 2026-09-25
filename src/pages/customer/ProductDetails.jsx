import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/shop/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error("Failed to load product:", err);

        setError(
          err.response?.data?.error ||
            "Unable to load this workshop product.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <PageHeader onBack={() => navigate("/customer/shop")} />

        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading product...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load the product details.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <PageHeader onBack={() => navigate("/customer/shop")} />

        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-700">
              {error || "Product not found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/customer/shop")}
              className="mt-5 rounded-lg bg-[#0F3D5E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#082F49]"
            >
              Back to shop
            </button>
          </div>
        </section>
      </main>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader onBack={() => navigate("/customer/shop")} />

      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/customer/shop")}
          className="mb-5 text-sm font-semibold text-[#0F3D5E] transition hover:text-[#F59E0B]"
        >
          ← Back to shop
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="flex min-h-80 items-center justify-center bg-slate-100 p-8 sm:min-h-96">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0F3D5E] text-5xl font-bold text-[#FBBF24] shadow-lg">
                {product.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F59E0B]">
                {product.category?.name || "Workshop"}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#082F49] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-[#082F49]">
                {formatPrice(product.price)}
              </p>

              <div
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  inStock
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {inStock
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </div>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#082F49]">
                  Product description
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.description ||
                    "This is a workshop-made product. Contact us for more information about this item."}
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  disabled={!inStock}
                  className="w-full rounded-xl bg-[#F59E0B] px-5 py-3.5 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {inStock ? "Add to cart" : "Out of stock"}
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                Cart functionality will be connected in the next shop step.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PageHeader({ onBack }) {
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

        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E] sm:px-4"
        >
          Shop
        </button>
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

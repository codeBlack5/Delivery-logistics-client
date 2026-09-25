import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");
      setCart(response.data.cart);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError(
        err.response?.data?.error ||
          "Unable to load your shopping cart.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId, quantity) {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(itemId);
      setError("");

      const response = await api.patch(`/cart/items/${itemId}`, {
        quantity,
      });

      setCart(response.data.cart);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      setError(
        err.response?.data?.error ||
          "Unable to update this cart item.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function removeItem(itemId) {
    try {
      setUpdatingItemId(itemId);
      setError("");

      const response = await api.delete(`/cart/items/${itemId}`);

      setCart(response.data.cart);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      setError(
        err.response?.data?.error ||
          "Unable to remove this cart item.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader
        onShop={() => navigate("/customer/shop")}
        onDashboard={() => navigate("/customer")}
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F59E0B]">
            Workshop shop
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#082F49] sm:text-4xl">
            Your cart
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Review your workshop products before checkout.
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
              Loading your cart...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we retrieve your cart.
            </p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <EmptyCart onShop={() => navigate("/customer/shop")} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const updating = updatingItemId === item.id;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F3D5E] text-xl font-bold text-[#FBBF24]">
                          {item.product.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">
                          Workshop product
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#082F49]">
                          {item.product.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatPrice(item.product.price)} each
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {item.product.stock_quantity} currently in stock
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                          <button
                            type="button"
                            disabled={updating || item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-2 text-lg font-bold text-[#0F3D5E] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm font-bold text-[#082F49]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={
                              updating ||
                              item.quantity >= item.product.stock_quantity
                            }
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-2 text-lg font-bold text-[#0F3D5E] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-[#082F49]">
                            {formatPrice(item.subtotal)}
                          </p>

                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => removeItem(item.id)}
                            className="mt-1 text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
                Order summary
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                Cart total
              </h2>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-medium text-slate-500">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#082F49]">
                  {formatPrice(cart.total)}
                </span>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-xl bg-[#F59E0B] px-5 py-3.5 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Checkout
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Checkout and payment will be connected in the next shop step.
              </p>

              <button
                type="button"
                onClick={() => navigate("/customer/shop")}
                className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0F3D5E] transition hover:border-[#0F3D5E] hover:bg-slate-50"
              >
                Continue shopping
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyCart({ onShop }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F3D5E] text-2xl font-bold text-[#FBBF24]">
        🛒
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#082F49]">
        Your cart is empty
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Browse our workshop products and add something you would like
        delivered to you.
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

function PageHeader({ onShop, onDashboard }) {
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
            onClick={onShop}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
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

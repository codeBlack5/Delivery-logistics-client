import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");
      const loadedCart = response.data?.cart;

      if (!loadedCart || loadedCart.items?.length === 0) {
        navigate("/customer/cart");
        return;
      }

      setCart(loadedCart);
    } catch (err) {
      console.error("Failed to load checkout cart:", err);

      setError(
        err.response?.data?.error ||
          "Unable to load your cart for checkout.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/orders", {
        payment_method: paymentMethod,
      });

      const order = response.data?.order;

      if (order?.id) {
        navigate(`/customer/orders/${order.id}`);
        return;
      }

      navigate("/customer/orders");
    } catch (err) {
      console.error("Failed to place order:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.errors?.join(", ") ||
          "Unable to place your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <PageHeader
          onShop={() => navigate("/customer/shop")}
          onDashboard={() => navigate("/customer")}
        />

        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading checkout...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we retrieve your cart.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!cart) {
    return null;
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
            Checkout
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Review your order and choose how you would like to pay.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
                Payment method
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                How would you like to pay?
              </h2>

              <div className="mt-5 space-y-3">
                <PaymentOption
                  value="cash"
                  selected={paymentMethod === "cash"}
                  onChange={setPaymentMethod}
                  title="Cash"
                  description="Pay in cash when your order is processed."
                  icon="💵"
                />

                <PaymentOption
                  value="mpesa"
                  selected={paymentMethod === "mpesa"}
                  onChange={setPaymentMethod}
                  title="M-Pesa"
                  description="Pay using M-Pesa. Your payment will remain pending until completed."
                  icon="📱"
                />
              </div>
            </section>

            <button
              type="button"
              onClick={() => navigate("/customer/cart")}
              disabled={placingOrder}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#0F3D5E] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Back to cart
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
              Order summary
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#082F49]">
              Your order
            </h2>

            <div className="mt-5 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#082F49]">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <p className="shrink-0 font-bold text-[#082F49]">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

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
              onClick={placeOrder}
              disabled={placingOrder}
              className="mt-6 w-full rounded-xl bg-[#F59E0B] px-5 py-3.5 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {placingOrder ? "Placing order..." : "Place order"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Your order will be created with the selected payment method.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PaymentOption({
  value,
  selected,
  onChange,
  title,
  description,
  icon,
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
        selected
          ? "border-[#F59E0B] bg-amber-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name="payment_method"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 accent-[#F59E0B]"
      />

      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block font-bold text-[#082F49]">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

function formatPrice(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
}

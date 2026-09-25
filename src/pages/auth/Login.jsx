import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;

      if (Array.isArray(data?.errors)) {
        setError(data.errors.join(", "));
      } else {
        setError(
          data?.error ||
            data?.message ||
            "Unable to sign in. Please check your email and password."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#082F49] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2">
          {/* Branding panel */}
          <section className="relative hidden overflow-hidden bg-[#0F3D5E] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative shapes */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative">
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B] font-bold text-[#082F49] shadow-lg">
                  DL
                </div>

                <div>
                  <p className="text-lg font-bold">Delivery Logistics</p>
                  <p className="text-xs text-blue-100/70">
                    Reliable delivery management
                  </p>
                </div>
              </div>

              <div className="max-w-lg">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#FBBF24]">
                  Workshop delivery management
                </p>

                <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                  Deliver smarter.
                  <span className="block text-[#FBBF24]">
                    Track everything.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-blue-100/80">
                  Manage deliveries, follow package progress, and keep every
                  delivery operation organized from one place.
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-4">
              <p className="text-sm text-blue-100/60">
                Delivery Logistics MVP
              </p>

              <div className="h-1 w-16 rounded-full bg-[#F59E0B]" />
            </div>
          </section>

          {/* Login form */}
          <section className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile branding */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] font-bold text-[#082F49] shadow-sm">
                  DL
                </div>

                <div>
                  <p className="font-bold text-[#0F3D5E]">
                    Delivery Logistics
                  </p>
                  <p className="text-xs text-slate-500">
                    Reliable delivery management
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-[#F59E0B]">
                  Welcome back
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-[#082F49] sm:text-3xl">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Continue to your delivery workspace.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/10"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/10"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center rounded-xl bg-[#F59E0B] px-4 py-3 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  New to Delivery Logistics?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#0F3D5E] underline decoration-[#F59E0B] underline-offset-4 transition hover:text-[#082F49]"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const roleLabels = {
  customer: "Customer",
  rider: "Rider",
  admin: "Administrator",
  shop: "Shop",
};

const rolePaths = {
  customer: "/customer",
  rider: "/rider",
  admin: "/admin",
  shop: "/shop",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (passwordForm.password.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.patch("/auth/password", passwordForm);
      setPasswordSuccess(
        response.data?.message || "Password updated successfully."
      );
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmation(false);
    } catch (err) {
      const data = err.response?.data;
      if (Array.isArray(data?.errors)) {
        setPasswordError(data.errors.join(", "));
      } else {
        setPasswordError(
          data?.error || data?.message || "Unable to update password. Please try again."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  }

  if (!user) {
    return null;
  }

  const role = roleLabels[user.role] || user.role;
  const dashboardPath = rolePaths[user.role] || "/dashboard";

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
                Steelo Logistics
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Reliable delivery management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl bg-[#0F3D5E] shadow-xl">
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/10" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FBBF24]">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Hello, {user.name}.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
                Your Steelo Logistics workspace is ready. Manage your
                deliveries and keep everything moving from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#F59E0B]">
                Account
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                Your profile
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {user.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account type
                </p>
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0F3D5E]">
                  {role}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-full flex-col">
              <div>
                <p className="text-sm font-semibold text-[#F59E0B]">
                  Workspace
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#082F49]">
                  Your dashboard is ready
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Continue to your {role.toLowerCase()} workspace to manage
                  deliveries and access the tools available to your account.
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => navigate(dashboardPath)}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 sm:w-auto"
                >
                  Open {role} Dashboard
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#F59E0B]">Security</p>
            <h2 className="mt-1 text-xl font-bold text-[#082F49]">
              Change password
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Confirm your current password before choosing a new one.
            </p>
          </div>

          {passwordError && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="current_password" className="mb-2 block text-sm font-medium text-slate-700">
                  Current password
                </label>
                <div className="relative">
                  <input
                    id="current_password"
                    name="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/10"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword((value) => !value)} aria-controls="current_password" aria-label={showCurrentPassword ? "Hide current password" : "Show current password"} className="absolute inset-y-0 right-3 rounded text-sm font-semibold text-[#0F3D5E] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="new_password" className="mb-2 block text-sm font-medium text-slate-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    name="password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    minLength={6}
                    maxLength={72}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/10"
                  />
                  <button type="button" onClick={() => setShowNewPassword((value) => !value)} aria-controls="new_password" aria-label={showNewPassword ? "Hide new password" : "Show new password"} className="absolute inset-y-0 right-3 rounded text-sm font-semibold text-[#0F3D5E] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.password_confirmation}
                    onChange={handlePasswordChange}
                    minLength={6}
                    maxLength={72}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none focus:border-[#0F3D5E] focus:ring-2 focus:ring-[#0F3D5E]/10"
                  />
                  <button type="button" onClick={() => setShowConfirmation((value) => !value)} aria-controls="password_confirmation" aria-label={showConfirmation ? "Hide password confirmation" : "Show password confirmation"} className="absolute inset-y-0 right-3 rounded text-sm font-semibold text-[#0F3D5E] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
                    {showConfirmation ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#082F49] focus:outline-none focus:ring-2 focus:ring-[#0F3D5E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {changingPassword ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

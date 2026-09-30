import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const customerLinks = [
  { label: "Dashboard", to: "/customer" },
  { label: "Shop", to: "/customer/shop" },
  { label: "Orders", to: "/customer/orders" },
  { label: "Cart", to: "/customer/cart", cart: true },
];

const riderLinks = [
  { label: "Dashboard", to: "/rider" },
];

const adminLinks = [
  { label: "Dashboard", to: "/admin" },
];

const shopLinks = [
  { label: "Dashboard", to: "/shop" },
];

function navLinkClass({ isActive }) {
  return [
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-[#0F3D5E] text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-[#082F49]",
  ].join(" ");
}

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const links =
    user?.role === "customer"
      ? customerLinks
      : user?.role === "rider"
        ? riderLinks
        : user?.role === "shop"
          ? shopLinks
          : adminLinks;

  useEffect(() => {
    let cancelled = false;

    async function loadCartCount() {
      if (user?.role !== "customer") {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get("/cart");

        if (!cancelled) {
          const items = response.data?.cart?.items || [];
          const count = items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0,
          );

          setCartCount(count);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load cart count:", err);
          setCartCount(0);
        }
      }
    }

    loadCartCount();

    return () => {
      cancelled = true;
    };
  }, [user?.role, location.pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
      setMobileOpen(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  const homePath =
    user?.role === "customer"
      ? "/customer"
      : user?.role === "rider"
        ? "/rider"
        : user?.role === "shop"
          ? "/shop"
          : "/admin";

  const workspaceLabel =
    user?.role === "customer"
      ? "Customer workspace"
      : user?.role === "rider"
        ? "Rider workspace"
        : user?.role === "shop"
          ? "Shop workspace"
          : "Admin workspace";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <NavLink
            to={homePath}
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] font-bold text-[#082F49] shadow-sm">
              SL
            </div>

            <div className="min-w-0">
              <p className="truncate font-bold text-[#082F49]">
                Steelo Logistics
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                {workspaceLabel}
              </p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === homePath}
                className={navLinkClass}
              >
                <span className="inline-flex items-center gap-2">
                  {link.label}

                  {link.cart && cartCount > 0 && (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[11px] font-bold text-[#082F49]">
                      {cartCount}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user?.name && (
              <span className="max-w-40 truncate text-sm font-medium text-slate-600">
                {user.name}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === homePath}
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  <span className="flex items-center justify-between">
                    {link.label}

                    {link.cart && cartCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[11px] font-bold text-[#082F49]">
                        {cartCount}
                      </span>
                    )}
                  </span>
                </NavLink>
              ))}

              {user?.name && (
                <div className="mt-2 border-t border-slate-100 px-3 py-3 text-sm text-slate-500">
                  Signed in as{" "}
                  <span className="font-semibold text-slate-700">
                    {user.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

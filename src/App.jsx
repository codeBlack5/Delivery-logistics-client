import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Shop from "./pages/customer/Shop";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import RiderDashboard from "./pages/rider/RiderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ShopDashboard from "./pages/shop/ShopDashboard";
import ShopProducts from "./pages/shop/ShopProducts";
import ShopProductForm from "./pages/shop/ShopProductForm";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<ProtectedRoute roles={["customer"]} />}>
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/customer/shop" element={<Shop />} />
              <Route path="/customer/shop/:id" element={<ProductDetails />} />
              <Route path="/customer/cart" element={<Cart />} />
              <Route path="/customer/checkout" element={<Checkout />} />
              <Route path="/customer/orders" element={<Orders />} />
              <Route path="/customer/orders/:id" element={<OrderDetails />} />
            </Route>

            <Route element={<ProtectedRoute roles={["rider"]} />}>
              <Route path="/rider" element={<RiderDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={["shop"]} />}>
              <Route path="/shop" element={<ShopDashboard />} />
              <Route path="/shop/products" element={<ShopProducts />} />
              <Route path="/shop/products/new" element={<ShopProductForm />} />
              <Route
                path="/shop/products/:id/edit"
                element={<ShopProductForm />}
              />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

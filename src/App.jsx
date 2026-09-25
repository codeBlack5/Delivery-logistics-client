import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Shop from "./pages/customer/Shop";
import ProductDetails from "./pages/customer/ProductDetails";
import RiderDashboard from "./pages/rider/RiderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
            </Route>

            <Route element={<ProtectedRoute roles={["rider"]} />}>
              <Route path="/rider" element={<RiderDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
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

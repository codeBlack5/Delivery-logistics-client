import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("delivery_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem(
          "delivery_user",
          JSON.stringify(response.data.user)
        );
      })
      .catch(() => {
        localStorage.removeItem("delivery_token");
        localStorage.removeItem("delivery_user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("delivery_token", token);
    localStorage.setItem("delivery_user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (data) => {
    const response = await api.post("/auth/register", data);

    const { token, user } = response.data;

    localStorage.setItem("delivery_token", token);
    localStorage.setItem("delivery_user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear the local JWT even if the API logout request fails.
    }

    localStorage.removeItem("delivery_token");
    localStorage.removeItem("delivery_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

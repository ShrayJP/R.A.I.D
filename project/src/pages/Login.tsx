import React, { useState } from "react";
import API from "../api";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login } = useAuth(); // ✅ Use auth context

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/register", {
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message || "Registration successful!");
      setIsRegistering(false); // Switch to login view
    } catch (error: any) {
      console.error("Registration Failed:", error.response?.data || error);
      toast.error("Registration failed. " + (error.response?.data?.message || "Try again"));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await API.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token); // ✅ Save token
      login(); // ✅ Update auth context
      toast.success("Login successful!");

      // Delay redirect slightly to show toast
      setTimeout(() => {
        window.location.href = "/disaster-identifier";
      }, 3000);
    } catch (error: any) {
      console.error("Login Failed:", error.response?.data || error);
      toast.error("Login failed. " + (error.response?.data?.message || "Try again"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <ToastContainer position="bottom-right" autoClose={2500} theme="dark"/>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? "Register" : "Login"}
        </h2>

        {isRegistering ? (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Register
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="emailLogin" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="emailLogin"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="passwordLogin" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="passwordLogin"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:underline ml-1"
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

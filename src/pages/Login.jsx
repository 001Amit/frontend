import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api"; // 👈 axios instance

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 FORGOT PASSWORD STATES
  const [mode, setMode] = useState("login"); // login | forgot | reset
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Invalid email");
      return false;
    }

    if (mode === "login") {
      if (!form.password || form.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
    }

    return true;
  };

  /* ================= LOGIN ================= */

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const res = await dispatch(loginUser(form));
    setLoading(false);

    if (res?.error?.status === 429) {
      toast.error("Too many attempts. Try later.");
      return;
    }

    if (res.meta.requestStatus === "fulfilled") {
      const role = res.payload.role;

      if (role === "admin") navigate("/admin");
      else if (role === "seller") navigate("/seller/orders");
      else navigate("/");
    } else {
      toast.error(res.payload || "Invalid credentials");
    }
  };

  /* ================= SEND OTP ================= */

  const sendOTP = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", {
        email: form.email,
      });
      setLoading(false);

      toast.success("OTP sent to email 📩");
      setMode("reset");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to send OTP");
    }
  };

  /* ================= RESET PASSWORD ================= */

  const resetPassword = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email: form.email,
        otp,
        newPassword,
      });

      setLoading(false);

      toast.success("Password reset successful ✅");
      setMode("login");
    } catch (err) {
      setLoading(false);
      toast.error("Invalid OTP or expired");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login"
            ? "Welcome"
            : mode === "forgot"
            ? "Forgot Password"
            : "Reset Password"}
        </h2>

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={submitHandler} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg pr-12"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* 🔥 FORGOT PASSWORD */}
            <p
              onClick={() => setMode("forgot")}
              className="text-sm text-blue-600 cursor-pointer text-center"
            >
              Forgot Password?
            </p>
          </form>
        )}

        {/* ================= FORGOT ================= */}
        {mode === "forgot" && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <button
              onClick={sendOTP}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p
              onClick={() => setMode("login")}
              className="text-sm text-gray-500 cursor-pointer text-center"
            >
              Back to Login
            </p>
          </div>
        )}

        {/* ================= RESET ================= */}
        {mode === "reset" && (
          <div className="space-y-4">
            <input
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full px-4 py-2 border rounded-lg"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* FOOTER */}
        {mode === "login" && (
          <p className="text-sm text-center text-gray-500 mt-5">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
            >
              Register
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

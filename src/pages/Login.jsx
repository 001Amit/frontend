import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 STEPS: login → forgot → otp → reset
  const [step, setStep] = useState("login");

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ================= LOGIN ================= */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields required");
    }

    setLoading(true);
    const res = await dispatch(loginUser(form));
    setLoading(false);

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

  const sendOtp = async () => {
    if (!resetEmail) return toast.error("Enter email");

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: resetEmail,
      });

      toast.success("OTP sent 📩");
      setStep("otp");
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit OTP");
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-reset-otp", {
        email: resetEmail,
        otp,
      });

      toast.success("OTP verified ✅");
      setStep("reset");
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */

  const resetPasswordHandler = async () => {
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email: resetEmail,
        password: newPassword,
      });

      toast.success("Password updated 🎉");

      // 🔥 reset everything
      setStep("login");
      setResetEmail("");
      setOtp("");
      setNewPassword("");
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">

        {/* ================= LOGIN ================= */}
        {step === "login" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              Welcome 👋
            </h2>

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
                  className="absolute right-3 top-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <p
                className="text-sm text-blue-600 cursor-pointer text-right"
                onClick={() => {
                  setResetEmail(form.email); // 🔥 auto-fill email
                  setStep("forgot");
                }}
              >
                Forgot Password?
              </p>

              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        )}

        {/* ================= FORGOT ================= */}
        {step === "forgot" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Reset Password
            </h2>

            <input
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p
              onClick={() => setStep("login")}
              className="text-sm text-gray-500 text-center mt-3 cursor-pointer"
            >
              ← Back to Login
            </p>
          </>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Verify OTP
            </h2>

            <input
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg mb-4 text-center tracking-widest"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p
              onClick={() => setStep("forgot")}
              className="text-sm text-gray-500 text-center mt-3 cursor-pointer"
            >
              ← Change Email
            </p>
          </>
        )}

        {/* ================= RESET ================= */}
        {step === "reset" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              New Password
            </h2>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPasswordHandler}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!form.password) {
      toast.error("Password is required");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const res = await dispatch(loginUser(form));
    setLoading(false);

    if (res?.error?.status === 429) {
      toast.error("Too many login attempts. Please try again later.");
      return;
    }

    if (res.meta.requestStatus === "fulfilled") {
      const role = res.payload.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "seller") {
        navigate("/seller/orders");
      } else {
        navigate("/");
      }
    } else {
      toast.error(res.payload || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome
        </h2>

        {/* FORM */}
        <form onSubmit={submitHandler} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                className="absolute right-3 top-2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-500 mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
  // 🔥 FORGOT PASSWORD STATES
  const [step, setStep] = useState("login"); 
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ================= LOGIN ================= */

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    const res = await dispatch(loginUser(form));
    setLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    } else {
      toast.error(res.payload || "Invalid credentials");
    }
  };

  /* ================= FORGOT PASSWORD ================= */

  const sendOtp = async () => {
    if (!resetEmail) return toast.error("Enter email");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email: resetEmail });
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      await api.post("/auth/verify-reset-otp", {
        email: resetEmail,
        otp,
      });
      toast.success("OTP verified");
      setStep("reset");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordHandler = async () => {
    if (newPassword.length < 6) {
      return toast.error("Password too short");
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email: resetEmail,
        password: newPassword,
      });
      toast.success("Password updated 🎉");
      setStep("login");
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

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              {/* PASSWORD */}
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
                  👁️
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <p
                className="text-sm text-blue-600 cursor-pointer text-right"
                onClick={() => setStep("forgot")}
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

        {/* ================= FORGOT EMAIL ================= */}
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
            >
              Send OTP
            </button>
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
              className="w-full px-4 py-2 border rounded-lg mb-4 text-center"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Verify
            </button>
          </>
        )}

        {/* ================= RESET PASSWORD ================= */}
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
            >
              Update Password
            </button>
          </>
        )}

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-500 mt-5">
          Back to{" "}
          <span
            onClick={() => setStep("login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );

import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyEmail } from "../features/auth/authSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otpSent, loading } = useSelector((state) => state.auth);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= VALIDATION ================= */

  const validateRegister = () => {
    const { name, email, password, role } = registerData;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      toast.error("Enter valid name");
      return false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter valid email");
      return false;
    }

    if (
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      toast.error("Weak password (min 8 chars, upper, lower, number)");
      return false;
    }

    if (!["customer", "seller"].includes(role)) {
      toast.error("Invalid role");
      return false;
    }

    return true;
  };

  const validateOTP = () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter valid 6-digit OTP");
      return false;
    }
    return true;
  };

  /* ================= HANDLERS ================= */

  const submitRegister = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    dispatch(registerUser(registerData));
  };

  const submitOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;

    const res = await dispatch(
      verifyEmail({
        email: registerData.email,
        otp,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Email verified 🎉");
      setOtpVerified(true);
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  /* ================= REDIRECT ================= */

  useEffect(() => {
    if (otpVerified) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [otpVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">

        {!otpSent ? (
          <>
            {/* HEADER */}
            <h2 className="text-2xl font-bold text-center mb-6">
              Create Account 🚀
            </h2>

            {/* FORM */}
            <form onSubmit={submitRegister} className="space-y-5">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600">Password</label>

                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className="w-full px-4 py-2 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
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
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm text-gray-600">Account Type</label>

                <select
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      role: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            {/* OTP SCREEN */}
            <h2 className="text-2xl font-bold text-center mb-6">
              Verify Email 📩
            </h2>

            <form onSubmit={submitOTP} className="space-y-5">
              <input
                placeholder="Enter 6-digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                className="w-full px-4 py-2 border rounded-lg text-center tracking-widest text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

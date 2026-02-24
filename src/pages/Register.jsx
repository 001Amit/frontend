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

  /* ================= VALIDATION ================= */

  const validateRegister = () => {
    const { name, email, password, role } = registerData;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      toast.error("Name must contain only letters and be at least 2 characters");
      return false;
    }

    if (!email) {
      toast.error("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
      return false;
    }

    if (!["customer", "seller"].includes(role)) {
      toast.error("Invalid role selected");
      return false;
    }

    return true;
  };

  const validateOTP = () => {
    if (!otp) {
      toast.error("OTP is required");
      return false;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT HANDLERS ================= */

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
      toast.success("Email verified successfully 🎉");
      setOtpVerified(true);
    } else {
      toast.error(res.payload || "Invalid or expired OTP ❌");
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      {!otpSent ? (
        <form onSubmit={submitRegister}>
          <h2 className="text-xl mb-4">Register</h2>

          <input
            placeholder="Name"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            type="email"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />

          <select
            value={registerData.role}
            onChange={(e) =>
              setRegisterData({ ...registerData, role: e.target.value })
            }
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitOTP}>
          <h2 className="text-xl mb-4">Verify Email</h2>

          <input
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            required
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
  );
}

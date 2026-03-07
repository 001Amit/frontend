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
    <div className="max-w-md mx-auto mt-10 p-6 border">
      <h2 className="text-xl mb-4">Login</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          placeholder="Email"
          className="input w-full"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD FIELD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input w-full pr-10"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="btn w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

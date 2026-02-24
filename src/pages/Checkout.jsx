import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  /* ================= ROUTE GUARD ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart, isAuthenticated, navigate]);

  /* ================= VALIDATION ================= */

  const validateAddress = () => {
    const { address: addr, city, state, pincode, phone } = address;

    if (!addr.trim() || addr.length < 10) {
      alert("Please enter a complete delivery address");
      return false;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(city)) {
      alert("Please enter a valid city name");
      return false;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(state)) {
      alert("Please enter a valid state name");
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Pincode must be exactly 6 digits");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!["COD", "ONLINE"].includes(method)) {
      alert("Invalid payment method");
      return false;
    }

    return true;
  };

  /* ================= PLACE ORDER ================= */

  const placeOrder = async () => {
    if (!validateAddress()) return;

    try {
      setLoading(true);

      // 1️⃣ CREATE ORDER
      const { data } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: method,
      });
      const orders = data.orders; // ← ARRAY from backend
      //calculate total for all seller orders
      const totalAmount = orders.reduce(
        (sum, ord) => sum + ord.totalAmount,
        0
      );




      // 2️⃣ CASH ON DELIVERY
      if (method === "COD") {
        navigate("/orders");
        return;
      }

      // 3️⃣ ONLINE PAYMENT
      const paymentRes = await api.post("/payment/create-order", {
        amount: totalAmount,
      });

      const options = {
        key: paymentRes.data.key,
        amount: paymentRes.data.order.amount,
        currency: "INR",
        name: "Multi Vendor Store",
        description: "Order Payment",
        order_id: paymentRes.data.order.id,

        handler: async function (response) {
          await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderIds: orders.map(o => o._id),
          });

          alert("Payment successful!");
          navigate("/orders");
        },

        modal: {
          ondismiss: async function () {
            await api.post("/orders/cancel-multiple", {
              orderIds: orders.map(o => o._id),
            });
            alert("Payment cancelled. Order not placed.");
          },
        },


        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <input
        placeholder="Full Address"
        value={address.address}
        onChange={(e) =>
          setAddress({ ...address, address: e.target.value })
        }
      />

      <input
        placeholder="City"
        value={address.city}
        onChange={(e) =>
          setAddress({
            ...address,
            city: e.target.value.replace(/[^A-Za-z\s]/g, ""),
          })
        }
      />

      <input
        placeholder="State"
        value={address.state}
        onChange={(e) =>
          setAddress({
            ...address,
            state: e.target.value.replace(/[^A-Za-z\s]/g, ""),
          })
        }
      />

      <input
        placeholder="Pincode"
        maxLength={6}
        value={address.pincode}
        onChange={(e) =>
          setAddress({
            ...address,
            pincode: e.target.value.replace(/\D/g, ""),
          })
        }
      />

      <input
        placeholder="Phone Number"
        maxLength={10}
        value={address.phone}
        onChange={(e) =>
          setAddress({
            ...address,
            phone: e.target.value.replace(/\D/g, ""),
          })
        }
      />

      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
      </select>

      <button disabled={loading} onClick={placeOrder}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}

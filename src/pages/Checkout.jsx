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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!cart || cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart, isAuthenticated, navigate]);

  const validateAddress = () => {
    const { address: addr, city, state, pincode, phone } = address;

    if (!addr.trim() || addr.length < 10) return alert("Enter valid address"), false;
    if (!/^[A-Za-z\s]{2,}$/.test(city)) return alert("Invalid city"), false;
    if (!/^[A-Za-z\s]{2,}$/.test(state)) return alert("Invalid state"), false;
    if (!/^\d{6}$/.test(pincode)) return alert("Invalid pincode"), false;
    if (!/^[6-9]\d{9}$/.test(phone)) return alert("Invalid phone"), false;

    return true;
  };

  const placeOrder = async () => {
    if (!validateAddress()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: method,
      });

      const orders = data.orders;

      const totalAmount = orders.reduce(
        (sum, ord) => sum + ord.totalAmount,
        0
      );

      if (method === "COD") {
        navigate("/orders");
        return;
      }

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
            orderIds: orders.map((o) => o._id),
          });

          navigate("/orders");
        },

        modal: {
          ondismiss: async function () {
            await api.post("/orders/cancel-multiple", {
              orderIds: orders.map((o) => o._id),
            });
            alert("Payment cancelled");
          },
        },

        theme: { color: "#2874f0" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) return null;

  const total = cart.totalPrice;

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT FORM */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl shadow">

          <h1 className="text-xl font-semibold mb-4">Delivery Details</h1>

          <div className="grid gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Full Address"
              value={address.address}
              onChange={(e) =>
                setAddress({ ...address, address: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded"
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
                className="border p-2 rounded"
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded"
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
                className="border p-2 rounded"
                placeholder="Phone"
                maxLength={10}
                value={address.phone}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>

            {/* PAYMENT */}
            <div>
              <h3 className="font-medium mt-3 mb-1">Payment Method</h3>

              <select
                className="border p-2 rounded w-full"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-5 rounded-xl shadow h-fit sticky top-20">

          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-4 bg-yellow-400 py-2 rounded font-medium hover:bg-yellow-300"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

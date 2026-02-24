import api from "../../services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddToCart({ productId, variantId }) {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const add = async () => {
    if (!variantId) {
      toast.error("Please select a variant");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login first to add items to cart 🔒");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await api.post("/cart", {
        productId,
        variantId,
        quantity: Number(qty),
      });

      toast.success("Added to cart 🛒");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <input
        type="number"
        value={qty}
        min={1}
        onChange={(e) => setQty(e.target.value)}
        className="border p-2 w-20"
      />
      <button
      onClick={add}
      disabled={!variantId}
      className={`px-4 py-2 rounded text-white ${
        !variantId ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        >
          Add to Cart
          </button>
          </div>
          );
        }

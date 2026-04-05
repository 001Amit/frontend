import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateItem,
  removeItem,
  applyCoupon,
} from "../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, discount } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  if (!isAuthenticated || !cart) return null;

  const isEmpty = cart.items.length === 0;
  const total = Math.max(cart.totalPrice - discount, 0);

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT: CART ITEMS */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-4">

          <h1 className="text-xl font-semibold mb-4">Shopping Cart</h1>

          {isEmpty && (
            <p className="text-gray-500">
              Your cart is empty. Start shopping 🛍️
            </p>
          )}

          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border-b pb-4"
              >
                {/* IMAGE */}
                <img
                  src={item.product?.images?.[0]?.url}
                  alt={item.product?.name}
                  className="w-24 h-24 object-contain rounded"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.product?.name}
                  </h3>

                  <p className="text-blue-600 font-semibold mt-1">
                    ₹{item.price}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-4 mt-2">

                    {/* QUANTITY */}
                    <div className="flex items-center border rounded">
                      <button
                        className="px-2"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          dispatch(
                            updateItem({
                              id: item._id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                      >
                        –
                      </button>

                      <span className="px-3">
                        {item.quantity}
                      </span>

                      <button
                        className="px-2"
                        onClick={() =>
                          dispatch(
                            updateItem({
                              id: item._id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => dispatch(removeItem(item._id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COUPON */}
          {!isEmpty && <Coupon cartTotal={cart.totalPrice} />}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-xl shadow p-4 h-fit sticky top-20">

          <h2 className="text-lg font-semibold mb-3">
            Price Details
          </h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Price</span>
            <span>₹{cart.totalPrice}</span>
          </div>

          <div className="flex justify-between text-sm mb-2 text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {!isEmpty ? (
            <Link
              to="/checkout"
              className="block text-center mt-4 bg-yellow-400 py-2 rounded font-medium hover:bg-yellow-300"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <button
              className="w-full mt-4 bg-gray-300 py-2 rounded"
              disabled
            >
              Add items to checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== COUPON ===== */

function Coupon({ cartTotal }) {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");

  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Enter coupon"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={() => dispatch(applyCoupon({ code, cartTotal }))}
        disabled={!code.trim()}
        className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  );
}

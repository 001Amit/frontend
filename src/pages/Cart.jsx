import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateItem,
  removeItem,
  applyCoupon,
} from "../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

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
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      {isEmpty && (
        <p className="cart-empty">
          Your cart is empty. Add some products to continue shopping.
        </p>
      )}

      {/* CART ITEMS */}
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item._id} className="cart-item">
            <img
              src={item.product?.images?.[0]?.url}
              alt={item.product?.name}
              className="cart-item-image"
            />

            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.product?.name}</h3>

              <p className="cart-item-price">₹{item.price}</p>

              <div className="cart-item-actions">
                {/* QUANTITY */}
                <div className="qty-box">
                  <button
                    className="qty-btn"
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

                  <span className="qty-value">{item.quantity}</span>

                  <button
                    className="qty-btn"
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
                  className="remove-btn"
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

      {/* SUMMARY */}
      <div className="cart-summary">
        <h2>Total: ₹{total}</h2>

        {!isEmpty ? (
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        ) : (
          <button className="checkout-btn disabled" disabled>
            Add items to checkout
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= COUPON COMPONENT ================= */

function Coupon({ cartTotal }) {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");

  return (
    <div className="coupon-box">
      <input
        type="text"
        placeholder="Coupon Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={() => dispatch(applyCoupon({ code, cartTotal }))}
        disabled={!code.trim()}
      >
        Apply
      </button>
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../features/order/orderSlice";
import api from "../../services/api";
import toast from "react-hot-toast";
import "../../styles/myOrders.css";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);
  useEffect(() => {
  console.log("ORDERS FROM REDUX:", orders);
}, [orders]);

  const cancelItem = async (orderId, itemId) => {
    if (!window.confirm("Are you sure you want to cancel this item?")) return;

    try {
      await api.post("/orders/cancel-item", { orderId, itemId });
      toast.success("Item cancelled");
      dispatch(fetchMyOrders());
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const getPaymentLabel = (order) => {
    if (order.paymentMethod === "COD") {
      return "Cash on Delivery";
    }

    const allPending = order.items.every(
      (item) => item.status === "PENDING_PAYMENT"
    );

    return allPending ? "Online (Pending)" : "Online (Paid)";
  };

  const formatStatus = (status) => {
    return status.replaceAll("_", " ");
  };

  if (loading) {
    return <p className="orders-loading">Loading your orders...</p>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 && (
        <p className="orders-empty">
          You haven’t placed any orders yet.
        </p>
      )}

      {orders.map((order) => {
        const isDelivered = order.items.every(
          (i) => i.status === "DELIVERED"
        );
        return (
          <div key={order._id} className="order-card">
            {/* ===== HEADER ===== */}
            <div className="order-header">
              <div>
                <p className="order-id">
                  Order #{order._id.slice(-6)}
                </p>

                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="order-payment">
                  Payment: {getPaymentLabel(order)}
                </p>
              </div>

              <span
                className={`order-status ${
                  isDelivered ? "delivered" : "progress"
                }`}
              >
                {isDelivered ? "Delivered" : "In Progress"}
              </span>
            </div>

            {/* ===== ITEMS ===== */}
            <div className="order-items">
              {order.items.map((item) => (
                
                <div key={item._id} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                  />

                  <div className="order-item-info">
                    <p className="item-name">{item.name}</p>

                    {/* Variant Display */}
                    {(item.variantName ||
                      item.variantColor ||
                      item.variantSize) && (
                      <p className="item-variant">
                        Variant:{" "}
                        {item.variantName ||
                          `${item.variantColor || ""}${
                            item.variantColor && item.variantSize
                              ? " / "
                              : ""
                          }${item.variantSize || ""}`}
                      </p>
                    )}

                    <p className="item-meta">
                      Qty: {item.quantity} • ₹{item.price}
                    </p>

                    <div className="item-actions">
                      <span
                        className={`item-status ${item.status.toLowerCase()}`}
                      >
                        {formatStatus(item.status)}
                      </span>

                      {!["SHIPPED", "DELIVERED", "CANCELLED"].includes(
                        item.status
                      ) && (
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            cancelItem(order._id, item._id)
                          }
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== FOOTER ===== */}
            <div className="order-footer">
              <span className="order-total">
                Total: ₹{order.totalAmount}
              </span>

              <span className="order-payment-method">
                {order.paymentMethod}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
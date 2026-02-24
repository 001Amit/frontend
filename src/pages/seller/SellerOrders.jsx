import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import toast from "react-hot-toast";

const STATUS_TABS = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PLACED");

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    api.get("/orders/seller").then((res) => {
      setOrders(res.data.orders || []);
    });
  }, []);

  /* ================= FETCH EARNINGS ================= */
  useEffect(() => {
    api.get("/seller/earnings").then((res) => {
      setEarnings(res.data);
    });
  }, []);

  /* ================= UPDATE STATUS / CANCEL ================= */
  const updateStatus = async (orderId, itemId, status) => {
    try {
      if (status === "CANCELLED") {
        await api.put("/orders/seller/cancel-item", {
          orderId,
          itemId,
        });
        toast.success("Item cancelled");
      } else {
        await api.put("/orders/seller/item-status", {
          orderId,
          itemId,
          status,
        });
        toast.success("Status updated");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId
                    ? { ...item, status }
                    : item
                ),
              }
            : order
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  /* ================= FILTER ITEMS ================= */
  const filteredOrders = orders
    .map((order) => ({
      ...order,
      items: order.items.filter(
        (item) => item.status === activeStatus
      ),
    }))
    .filter((order) => order.items.length > 0);

  return (
    <DashboardLayout
      title="Seller Orders"
      links={[
        { to: "/seller/orders", label: "Orders" },
        { to: "/seller/products", label: "Products" },
        { to: "/seller/earnings", label: "Earnings" },
      ]}
    >
      {/* ================= EARNINGS ================= */}
      {earnings && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>COD Earnings (Collected)</h3>
            <p>₹{earnings.codEarnings}</p>
          </div>

          <div className="stat-card">
            <h3>Online Earnings (Pending)</h3>
            <p>₹{earnings.onlinePending}</p>
          </div>

          <div className="stat-card">
            <h3>Online Earnings (Settled)</h3>
            <p>₹{earnings.onlineSettled}</p>
          </div>

          <div className="stat-card highlight">
            <h3>Total Earnings</h3>
            <p>₹{earnings.totalEarnings}</p>
          </div>

          <div className="stat-card">
            <h3>Items Sold</h3>
            <p>{earnings.totalItemsSold}</p>
          </div>
        </div>
      )}

      {/* ================= STATUS TABS ================= */}
      <div className="order-tabs">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            className={`order-tab ${
              activeStatus === status ? "active" : ""
            }`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= ORDERS ================= */}
      {filteredOrders.length === 0 && (
        <p>No {activeStatus.toLowerCase()} items</p>
      )}

      {filteredOrders.map((order) => (
        <div key={order._id} className="table-card mb-6">
          <h3>Order #{order._id.slice(-6)}</h3>

          {/* 🟢 PAYMENT INFO */}
          <p>
            <strong>Payment Method:</strong>{" "}
            {order.paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>

          {order.paymentMethod === "ONLINE" && (
            <p>
              <strong>Settlement Status:</strong>{" "}
              {order.items.some(
                (item) => item.adminSettlementStatus === "SETTLED"
              )
                ? "Settled"
                : "Pending"}
            </p>
          )}

          {/* CUSTOMER INFO */}
          <p>
            <strong>Customer:</strong>{" "}
            {order.user?.name} ({order.user?.email})
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.shippingAddress?.phone || "N/A"}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {order.shippingAddress?.city || "N/A"}
          </p>

          <p>
            <strong>Full Address:</strong>{" "}
            {order.shippingAddress?.address},{" "}
            {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} –{" "}
            {order.shippingAddress?.pincode}
          </p>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
  {order.items.map((item) => (
    <tr key={item._id}>
      <td>
        <strong>{item.name}</strong>

        {(item.variantName ||
          item.variantColor ||
          item.variantSize) && (
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            Variant:{" "}
            {item.variantName ||
              `${item.variantColor || ""}${
                item.variantColor && item.variantSize
                  ? " / "
                  : ""
              }${item.variantSize || ""}`}
          </div>
        )}
      </td>

      <td>{item.quantity}</td>

      <td>₹{item.price}</td>

      <td>{item.status.replaceAll("_", " ")}</td>

      <td>
        <select
          value={item.status}
          onChange={(e) =>
            updateStatus(
              order._id,
              item._id,
              e.target.value
            )
          }
          disabled={item.status === "DELIVERED"}
        >
          <option value="PLACED">PLACED</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      ))}
    </DashboardLayout>
  );
}

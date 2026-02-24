import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import adminLinks from "../../constants/adminLinks";

const FILTER_TABS = [
  "ALL",
  "COD",
  "ONLINE",
  "PENDING",
  "SETTLED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    api.get("/admin/orders").then((res) => {
      setOrders(res.data.orders || []);
    });
  }, []);

  const getPaymentLabel = (order) => {
    if (order.paymentMethod === "COD") {
      return "Cash on Delivery";
    }

    const isPending = order.items.some(
      (item) => item.status === "PENDING_PAYMENT"
    );

    return isPending ? "Online (Pending)" : "Online (Paid)";
  };

  const getSettlementStatus = (order) => {
  const settled = order.items.every(
    (item) =>
      item.status === "DELIVERED" &&
      item.adminSettlementStatus === "SETTLED"
  );

  return settled ? "Settled" : "Pending";
};

  /* ================= FILTER LOGIC ================= */
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;

    if (activeFilter === "COD") {
      return order.paymentMethod === "COD";
    }

    if (activeFilter === "ONLINE") {
      return order.paymentMethod === "ONLINE";
    }

    if (activeFilter === "PENDING") {
  return (
    order.paymentMethod === "ONLINE" &&
    order.items.some(
      (item) => item.adminSettlementStatus !== "SETTLED"
    )
  );
}

if (activeFilter === "SETTLED") {
  return order.items.every(
    (item) =>
      item.status === "DELIVERED" &&
      item.adminSettlementStatus === "SETTLED"
  );
}


    return true;
  });

  return (
    <DashboardLayout title="All Orders" links={adminLinks}>
      <div className="table-card">
        <h3>All Orders</h3>

        {/* ================= FILTER TABS ================= */}
        <div className="admin-filter-tabs">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${
                activeFilter === tab ? "active" : ""
              }`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {!filteredOrders.length && <p>No orders found</p>}

        {filteredOrders.map((order) => (
          <div key={order._id} className="admin-order-card">
            
            {/* ===== HEADER ===== */}
            <div className="admin-order-header">
              <div>
                <h4>Order #{order._id.slice(-6)}</h4>
                <p className="muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="admin-customer">
                <strong>{order.user?.name}</strong>
                <span>{order.user?.email}</span>
              </div>
            </div>

            {/* ===== PAYMENT INFO ===== */}
            <div className="admin-payment-info">
              <p>
                <strong>Payment:</strong> {getPaymentLabel(order)}
              </p>

              <p>
                <strong>Settlement:</strong> {getSettlementStatus(order)}
              </p>

              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
            </div>

            {/* ===== ITEMS TABLE ===== */}
            <table className="admin-order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.product?.name}</td>
                    <td>{item.seller?.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <span className={`status-pill ${item.status}`}>
                        {item.status.replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

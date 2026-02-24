import { useEffect, useState } from "react";
import api from "../../services/api";
import adminLinks from "../../constants/adminLinks";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((res) => {
      setStats(res.data.stats);
      setPendingSellers(res.data.stats.pendingSellers || []);
    });
    api.get("/admin/orders/recent").then((res) => setOrders(res.data.orders));
  }, []);

  const approveSeller = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setPendingSellers((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      links={adminLinks}
    >
      {/* ===== STATS ===== */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Sellers</h3>
            <p>{stats.totalSellers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>₹{stats.revenue}</p>
          </div>
        </div>
      )}

      {/* ===== PENDING SELLERS ===== */}
      {pendingSellers.length > 0 && (
        <div className="table-card">
          <h3>Pending Seller Approvals</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <button onClick={() => approveSeller(s._id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== RECENT ORDERS ===== */}
      <div className="table-card">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.user?.name}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import adminLinks from "../../constants/adminLinks";

export default function AdminSellerRevenue() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    api.get("/admin/revenue/sellers").then((res) => {
      setSellers(res.data.sellers);
    });
  }, []);

  return (
    <DashboardLayout title="Revenue by Seller" links={adminLinks}>
      <div className="table-card">
        <h3>Seller Revenue (Split by Payment)</h3>

        <table>
          <thead>
            <tr>
              <th>Seller</th>
              <th>Email</th>
              <th>Items Sold</th>
              <th>Online Revenue</th>
              <th>COD Revenue</th>
              <th>Total Revenue</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((s) => (
              <tr key={s.sellerId}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.itemsSold}</td>

                {/* Platform money */}
                <td style={{ color: "#2563eb" }}>
                  ₹{s.onlineRevenue}
                </td>

                {/* Seller-collected money */}
                <td style={{ color: "#92400e" }}>
                  ₹{s.codRevenue}
                </td>

                <td>
                  <strong>₹{s.totalRevenue}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="muted mt-2">
          🔵 Online = platform collected &nbsp; | &nbsp;
          🟠 COD = seller collected
        </p>
      </div>
    </DashboardLayout>
  );
}

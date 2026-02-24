import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import api from "../../services/api";
import adminLinks from "../../constants/adminLinks";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AdminSellerOrders() {
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    api.get("/admin/seller-orders").then((res) => {
      setSellers(res.data.sellers);
    });
  }, []);
  
  return (
    <DashboardLayout
      title="Seller Orders Overview"
      links={adminLinks}
    >
      <div className="table-card">
        <h3>Seller Order Summary</h3>

        <table>
          <thead>
            <tr>
              <th>Seller</th>
              <th>Email</th>
              <th>Delivered Orders</th>
              <th>Items Sold</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((s) => (
              <tr key={s.sellerId}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.orders}</td>
                <td>{s.itemsSold}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/seller-orders/${s.sellerId}`)
                    }
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function SellerEarnings() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/seller/earnings").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Loading earnings...</p>;

  return (
    <DashboardLayout
      title="Earnings"
      links={[
        { to: "/seller/orders", label: "Orders" },
        { to: "/seller/products", label: "Products" },
        { to: "/seller/earnings", label: "Earnings" },
      ]}
    >
      <div className="stats-grid">
         {/* COD SECTION */}
        <div className="stat-card">
          <h3>COD Earnings (Pending Settlement)</h3>
          <p>₹{data.codPending}</p>
        </div>

        <div className="stat-card">
          <h3>COD Earnings (Settled)</h3>
          <p>₹{data.codSettled}</p>
        </div>

         {/* online section */}
        <div className="stat-card">
          <h3>Online Earnings (Pending)</h3>
          <p>₹{data.onlinePending}</p>
        </div>

        <div className="stat-card">
          <h3>Online Earnings (Settled)</h3>
          <p>₹{data.onlineSettled}</p>
        </div>

        <div className="stat-card highlight">
          <h3>Total Earned</h3>
          <p>₹{data.totalEarnings}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

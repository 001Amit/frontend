import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import adminLinks from "../../constants/adminLinks";

export default function AdminSettlementHistory() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/admin/settlements/history").then((res) => {
      setRows(res.data.history || []);
    });
  }, []);

  return (
    <DashboardLayout title="Settlement History" links={adminLinks}>
      <div className="table-card">
        <h3>Completed Settlements</h3>

        {rows.length === 0 && <p>No settlements yet</p>}

        {rows.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Product</th>
                <th>Payment</th>
                <th>Commission</th>
                <th>Settled By</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.itemId}>
                  <td>
                    {r.sellerName}
                    <br />
                    <small>{r.sellerEmail}</small>
                  </td>

                  <td>
                    {r.productName}
                    <br />
                    <small>Qty: {r.quantity}</small>
                  </td>

                  <td>{r.paymentMethod}</td>

                  <td>₹{r.commissionAmount}</td>

                  <td>{r.settledBy || "Admin"}</td>

                  <td>
                    {r.settledAt
                      ? new Date(r.settledAt).toLocaleDateString()
                      : "pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

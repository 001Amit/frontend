import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import adminLinks from "../../constants/adminLinks";
import toast from "react-hot-toast";

export default function AdminItemSettlements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/admin/settlements/items").then((res) => {
      setItems(res.data.items);
    });
  }, []);

  const settleItem = async (orderId, itemId) => {
    try {
      await api.put("/admin/settlements/settle-item", {
        orderId,
        itemId,
      });

      toast.success("Settlement completed");

      setItems((prev) =>
        prev.filter(
          (i) => !(i.orderId === orderId && i.itemId === itemId)
        )
      );
    } catch {
      toast.error("Settlement failed");
    }
  };

  return (
    <DashboardLayout title="Item Settlements" links={adminLinks}>
      <div className="table-card">
        <h3>Pending Item Settlements</h3>

        {items.length === 0 && <p>No pending settlements 🎉</p>}

        {items.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Product</th>
                <th>Payment</th>
                <th>Commission</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((i) => (
                <tr key={i.itemId}>
                  <td>
                    {i.sellerName}
                    <br />
                    <small>{i.sellerEmail}</small>
                  </td>

                  <td>
                    {i.productName}
                    <br />
                    <small>Qty: {i.quantity}</small>
                  </td>

                  <td>{i.paymentMethod}</td>

                  <td
                    style={{
                      color:
                        i.paymentMethod === "COD" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{i.commissionAmount}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        settleItem(i.orderId, i.itemId)
                      }
                    >
                      Mark Settled
                    </button>
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

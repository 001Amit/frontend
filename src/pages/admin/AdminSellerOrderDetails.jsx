import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import adminLinks from "../../constants/adminLinks";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


export default function AdminSellerOrderDetails() {
  const { sellerId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  api
    .get(`/admin/seller-orders/${sellerId}`)
    .then((res) => setOrders(res.data.orders))
    .catch((err) => {
      console.error(err);
      setOrders([]);
    });
}, [sellerId]);

  return (
    <DashboardLayout
      title="Seller Order Details"
      links={adminLinks}
    >
      <div className="table-card">
        <h3>Orders for Seller</h3>

        {!orders.length && <p>No orders found</p>}

        {!!orders.length && (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={i}>
                  <td>{o.orderId}</td>
                  <td>
                    {o.customerName}
                    <br />
                    <small>{o.customerEmail}</small>
                  </td>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.total}</td>
                  <td>{o.status}</td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
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

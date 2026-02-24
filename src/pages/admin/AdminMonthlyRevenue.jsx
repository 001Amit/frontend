import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import adminLinks from "../../constants/adminLinks";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminMonthlyRevenue() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/admin/revenue/monthly").then((res) => {
      setData(res.data.revenue);
    });
  }, []);

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: data.map((d) => d.revenue),
        borderColor: "#2563eb",
        tension: 0.3,
      },
    ],
  };

  return (
    <DashboardLayout title="Monthly Revenue" links={adminLinks}>
      <div className="card">
        <Line data={chartData} />
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import adminLinks from "../../constants/adminLinks";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const banHandler = async (id) => {
    await api.put(`/admin/ban/${id}`);
    loadUsers();
  };

  const approveHandler = async (id) => {
    await api.put(`/admin/approve/${id}`);
    loadUsers();
  };

  const deleteHandler = async (id) => {
    if (
      !window.confirm(
        "This will permanently delete the user and all related data. Continue?"
      )
    )
      return;

    await api.delete(`/admin/users/${id}`);
    loadUsers();
  };

  return (
    <DashboardLayout
      title="User Management"
      links={adminLinks}
    >
      <div className="table-card">
        <h3>All Users</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isBanned ? "Banned" : "Active"}</td>
                <td>
                  {/* Approve seller */}
                  {u.role === "seller" && !u.isApproved && (
                    <button onClick={() => approveHandler(u._id)}>
                      Approve
                      </button>
                    )}

                   {/* Ban / Unban */}
                   <button
                   style={{ background: "crimson", marginLeft: 6 }}
                   onClick={() => banHandler(u._id)}
                   >
                    {u.isBanned ? "Unban" : "Ban"}
                    </button>

                    {/* ❌ Disable delete for admins */}
                    {u.role !== "admin" && (
                      <button
                      style={{
                        background: "#111",
                        marginLeft: 6,
                      }}
                      onClick={() => deleteHandler(u._id)}
                      >
                        Delete
                        </button>
                      )}
                      {/* Optional label for admin */}
                      {u.role === "admin" && (
                        <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>
                          Protected
                          </span>
                        )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

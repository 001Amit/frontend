import { useEffect, useState } from "react";
import api from "../../services/api";
import adminLinks from "../../constants/adminLinks";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 5;

  const loadCategories = async (pageNumber = 1) => {
    try {
      const { data } = await api.get(
        `/categories?page=${pageNumber}&limit=${limit}`
      );

      setCategories(data.categories);
      setPage(data.pagination.page);
      setPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    loadCategories(page);
  }, [page]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post("/categories", { name });
      }

      setName("");
      setEditingId(null);
      loadCategories(page);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      loadCategories(page);
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete");
    }
  };

  return (
    <DashboardLayout
      title="Manage Categories"
      links={adminLinks}
    >
      {/* ===== FORM ===== */}
      <div className="card">
        <h3>{editingId ? "Edit Category" : "Add Category"}</h3>

        <form onSubmit={submitHandler} className="flex gap-3">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button disabled={loading}>
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* ===== LIST ===== */}
      <div className="table-card">
        <h3>All Categories</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.productCount}</td>
                <td>
                  <button onClick={() => editCategory(c)}>Edit</button>
                  <button onClick={() => deleteCategory(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

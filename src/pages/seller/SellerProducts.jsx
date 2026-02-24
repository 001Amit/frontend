import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/products/seller/my-products?page=${pageNumber}&limit=5`
      );

      setProducts(res.data.products);
      setPage(res.data.pagination.page);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts(page);
  };

  return (
    <DashboardLayout
      title="My Products"
      links={[
        { to: "/seller/orders", label: "Orders" },
        { to: "/seller/products", label: "Products" },
        { to: "/seller/earnings", label: "Earnings" },
      ]}
    >
      <div className="table-card">
        <h3>My Products</h3>

        <button onClick={() => navigate("/seller/products/new")}>
          + Add Product
        </button>

        {!products.length && <p>No products added yet</p>}

        {!!products.length && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>
                      {p.variants?.map(v => `₹${v.price}`).join(", ")}
                      </td>
                      <td>
                      {p.variants?.map(v => v.stock).join(", ")}
                      </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/seller/products/edit/${p._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        style={{ background: "crimson", marginLeft: 6 }}
                        onClick={() => deleteHandler(p._id)}
                      >
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

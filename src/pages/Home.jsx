import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const dispatch = useDispatch();
  const { products = [], loading, page, pages } = useSelector(
    (s) => s.product || {}
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    dispatch(fetchProducts({ page: newPage }));
  };

  return (
    <>
      <section className="hero">
        <h1>Deaily Needs Carts</h1>
        <p>Secure payments · Trusted sellers · Fast delivery</p>
      </section>

      <section className="products">
        <h2>Featured Products</h2>

        {loading && <p>Loading...</p>}
        {!loading && !products.length && <p>No products found</p>}

        <div className="product-grid">
          {products.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id} className="product-card">
              <img src={p.images?.[0]?.url} alt={p.name} />
              <h4>{p.name}</h4>
              <p>⭐ {p.rating || 0}</p>
            </Link>
          ))}
        </div>

        {/* ===== PAGINATION ===== */}
        {pages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => changePage(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => changePage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}


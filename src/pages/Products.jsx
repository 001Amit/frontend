import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchProducts } from "../features/product/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, loading } = useSelector((s) => s.product);

  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    dispatch(fetchProducts({ keyword }));
  }, [dispatch, keyword]);

  return (
    <div className="products-page">
      <h1 className="products-title">
        {keyword ? `Search Results for "${keyword}"` : "All Products"}
      </h1>

      {loading && <p>Loading products...</p>}

      {!loading && products?.length === 0 && (
        <p>No products found</p>
      )}

      <div className="products-grid">
        {products?.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="product-card"
          >
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="product-image"
            />

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price"> ₹{product.price || product.variants?.[0]?.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

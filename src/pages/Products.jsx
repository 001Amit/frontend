import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { fetchProducts } from "../features/product/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const location = useLocation();
  const observer = useRef();

  const {
    products = [],
    loading,
    loadingMore,
    page,
    pages,
  } = useSelector((s) => s.product);

  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    // 🔥 reset & fetch new search
    dispatch(fetchProducts({ page: 1, keyword }));
  }, [dispatch, keyword]);

  // 🔥 Infinite scroll
  const lastProductRef = (node) => {
    if (loadingMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < pages) {
        dispatch(fetchProducts({ page: page + 1, keyword }));
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">

      {/* TITLE */}
      <h1 className="text-xl font-semibold mb-4">
        {keyword
          ? `Search Results for "${keyword}"`
          : "All Products"}
      </h1>

      {/* 🔥 INITIAL SKELETON */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl shadow animate-pulse"
            >
              <div className="h-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, index) => {
          if (products.length === index + 1) {
            return (
              <Link
                ref={lastProductRef}
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="h-40 w-full object-contain"
                />

                <h3 className="text-sm mt-2 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-blue-600 font-semibold">
                  ₹{product.price || product.variants?.[0]?.price}
                </p>
              </Link>
            );
          }

          return (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="h-40 w-full object-contain"
              />

              <h3 className="text-sm mt-2 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-blue-600 font-semibold">
                ₹{product.price || product.variants?.[0]?.price}
              </p>
            </Link>
          );
        })}
      </div>

      {/* 🔥 LOAD MORE SKELETON */}
      {loadingMore && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl shadow animate-pulse"
            >
              <div className="h-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

  // 🔥 FILTER STATES
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [price, setPrice] = useState([0, 10000]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        keyword,
        category,
        sort,
        min: price[0],
        max: price[1],
      })
    );
  }, [dispatch, keyword, category, sort, price]);

  // 🔥 INFINITE SCROLL
  const lastProductRef = (node) => {
    if (loading || loadingMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < pages) {
        dispatch(
          fetchProducts({
            page: page + 1,
            keyword,
            category,
            sort,
            min: price[0],
            max: price[1],
          })
        );
      }
    });

    if (node) observer.current.observe(node);
  };

  const getPrice = (p) => p.price ?? p.variants?.[0]?.price ?? 0;

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-4">

        {/* 🔥 FILTER SIDEBAR */}
        <div className="bg-white p-4 rounded-xl shadow h-fit">

          <h2 className="font-semibold mb-3">Filters</h2>

          {/* CATEGORY */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">Category</h3>
            {["Mobiles", "Fashion", "Electronics", "Home"].map((c) => (
              <label key={c} className="block text-sm">
                <input
                  type="radio"
                  name="category"
                  onChange={() => setCategory(c)}
                />{" "}
                {c}
              </label>
            ))}
          </div>

          {/* PRICE */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">Price</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={price[1]}
              onChange={(e) => setPrice([0, Number(e.target.value)])}
              className="w-full"
            />
            <p className="text-sm">Up to ₹{price[1]}</p>
          </div>

          {/* SORT */}
          <div>
            <h3 className="text-sm font-medium mb-1">Sort By</h3>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price">Price Low → High</option>
              <option value="-price">Price High → Low</option>
              <option value="-rating">Top Rated</option>
              <option value="-createdAt">Newest</option>
            </select>
          </div>
        </div>

        {/* 🔥 PRODUCTS */}
        <div className="md:col-span-3">

          <h1 className="text-xl font-semibold mb-4">
            {keyword ? `Search: ${keyword}` : "Products"}
          </h1>

          {/* LOADING */}
          {loading && <p>Loading...</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, index) => {
              const price = getPrice(p);

              const card = (
                <Link
                  to={`/product/${p._id}`}
                  key={p._id}
                  className="bg-white p-3 rounded-xl shadow hover:shadow-lg"
                >
                  <img
                    src={p.images?.[0]?.url}
                    className="h-40 w-full object-contain"
                  />
                  <h3 className="text-sm mt-2 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    ₹{price}
                  </p>
                </Link>
              );

              if (products.length === index + 1) {
                return (
                  <div ref={lastProductRef} key={p._id}>
                    {card}
                  </div>
                );
              }

              return card;
            })}
          </div>

          {/* LOAD MORE */}
          {loadingMore && (
            <p className="text-center mt-4">Loading more...</p>
          )}
        </div>
      </div>
    </div>
  );
}

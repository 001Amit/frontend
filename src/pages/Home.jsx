import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";

const categories = [
  { name: "Mobiles", img: "https://cdn-icons-png.flaticon.com/128/15/15874.png" },
  { name: "Fashion", img: "https://cdn-icons-png.flaticon.com/128/892/892458.png" },
  { name: "Electronics", img: "https://cdn-icons-png.flaticon.com/128/1041/1041886.png" },
  { name: "Home", img: "https://cdn-icons-png.flaticon.com/128/69/69524.png" },
  { name: "Beauty", img: "https://cdn-icons-png.flaticon.com/128/1077/1077035.png" },
];

export default function Home() {
  const dispatch = useDispatch();
  const observer = useRef();

  const {
    products = [],
    loading,
    loadingMore,
    page,
    pages,
  } = useSelector((s) => s.product || {});

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  // 🔥 Infinite Scroll
  const lastProductRef = (node) => {
    if (loadingMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < pages) {
        dispatch(fetchProducts({ page: page + 1 }));
      }
    });

    if (node) observer.current.observe(node);
  };

  // ✅ PRICE HELPERS
  const getPrice = (p) => {
    return p.price ?? p.variants?.[0]?.price ?? 0;
  };

  const getOriginalPrice = (p) => {
    const price = getPrice(p);
    return Math.round(price * 1.25); // fake MRP
  };

  const getDiscount = (p) => {
    const price = getPrice(p);
    const original = getOriginalPrice(p);

    if (!original || original <= price) return 0;

    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-b-2xl shadow-md">
        <h1 className="text-3xl font-bold">Daily Needs</h1>
        <p className="mt-2 text-sm opacity-90">
          Secure payments · Trusted sellers · Fast delivery
        </p>
      </section>

      {/* CATEGORIES */}
      <div className="flex gap-4 overflow-x-auto p-4 bg-white shadow-sm">
        {categories.map((cat, i) => (
          <div key={i} className="min-w-[80px] text-center cursor-pointer">
            <img src={cat.img} className="h-12 mx-auto mb-1" />
            <p className="text-sm">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section className="p-5">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>

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

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p, index) => {
            const price = getPrice(p);
            const original = getOriginalPrice(p);
            const discount = getDiscount(p);

            const card = (
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3 relative"
              >
                {/* 🔥 DISCOUNT BADGE */}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                )}

                <img
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="h-40 w-full object-contain mb-2"
                />

                <h4 className="text-sm font-medium line-clamp-2">
                  {p.name}
                </h4>

                <p className="text-yellow-500 text-sm mt-1">
                  ⭐ {p.rating || 0}
                </p>

                {/* 🔥 PRICE SECTION */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-600 font-semibold">
                    ₹{price}
                  </span>

                  <span className="text-gray-400 line-through text-sm">
                    ₹{original}
                  </span>

                  <span className="text-green-600 text-xs">
                    {discount}% off
                  </span>
                </div>
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
      </section>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { autocomplete, fetchProducts } from "../../features/product/productSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggestions } = useSelector((s) => s.product);

  const [q, setQ] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    setQ(value);

    if (value.length > 1) {
      dispatch(autocomplete(value));
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) return;

    dispatch(fetchProducts({ keyword }));
    navigate(`/products?keyword=${keyword}`);
    setQ("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(q);
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <input
          value={q}
          onChange={onChange}
          placeholder="Search products..."
          className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* 🔥 SUGGESTIONS */}
      {suggestions.length > 0 && q.length > 1 && (
        <ul className="absolute bg-white border w-full mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s._id}
              onClick={() => handleSearch(s.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

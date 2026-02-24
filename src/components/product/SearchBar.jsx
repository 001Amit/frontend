import { useDispatch, useSelector } from "react-redux";
import { autocomplete, fetchProducts } from "../../features/product/productSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ inside component
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
    navigate(`/products?keyword=${keyword}`); // ✅ navigate to products page
    setQ("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(q);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          value={q}
          onChange={onChange}
          placeholder="Search products..."
          className="border p-2 w-full"
        />
      </form>

      {suggestions.length > 0 && q.length > 1 && (
        <ul className="absolute bg-white border w-full z-50">
          {suggestions.map((s) => (
            <li
              key={s._id}
              onClick={() => handleSearch(s.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { toast } from "react-toastify";
import Select from "react-select";

export default function SellerProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "", // stores category _id
  });

  const [variants, setVariants] = useState([
    {
      size: "Default",
      color: "Default",
      price: "",
      stock: "",
    },
  ]);

  /* ================= FETCH ALL CATEGORIES ================= */
  useEffect(() => {
    api.get("/categories/all").then((res) => {
      setCategories(res.data.categories || []);
    });
  }, []);

  /* ================= EDIT PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    api.get(`/products/${id}`).then((res) => {
      const p = res.data.product;

      setForm({
        name: p.name || "",
        description: p.description || "",
        category: p.category?._id || "",
      });

      setVariants(
        p.variants?.length
          ? p.variants
          : [
              {
                size: "Default",
                color: "Default",
                price: "",
                stock: "",
              },
            ]
      );
    });
  }, [id]);

  /* ================= VARIANT HANDLERS ================= */
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", color: "", price: "", stock: "" },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      toast.error("At least one variant is required");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    for (const v of variants) {
      if (!v.price || !v.stock) {
        toast.error("Each variant must have price and stock");
        return;
      }
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("variants", JSON.stringify(variants));

      images.forEach((img) => {
        data.append("images", img);
      });

      if (id) {
        await api.put(`/products/${id}`, data);
        toast.success("Product updated");
      } else {
        await api.post("/products", data);
        toast.success("Product added");
      }

      navigate("/seller/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Product save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REACT-SELECT OPTIONS ================= */
  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const selectedCategory = categoryOptions.find(
    (c) => c.value === form.category
  );

  /* ================= UI ================= */
  return (
    <DashboardLayout
      title={id ? "Edit Product" : "Add Product"}
      links={[
        { to: "/seller/orders", label: "Orders" },
        { to: "/seller/products", label: "Products" },
        { to: "/seller/earnings", label: "Earnings" },
      ]}
    >
      <form className="table-card" onSubmit={submitHandler}>
        {/* NAME */}
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        {/* CATEGORY (SEARCHABLE) */}
        <Select
          options={categoryOptions}
          value={selectedCategory || null}
          placeholder="Search & select category..."
          onChange={(selected) =>
            setForm({ ...form, category: selected.value })
          }
          isClearable
        />

        {/* VARIANTS */}
        <h3 className="mt-6 font-semibold">Variants</h3>

        {variants.map((v, i) => (
          <div key={i} className="border p-4 rounded mt-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Size"
                value={v.size}
                onChange={(e) =>
                  updateVariant(i, "size", e.target.value)
                }
              />

              <input
                placeholder="Color"
                value={v.color}
                onChange={(e) =>
                  updateVariant(i, "color", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) =>
                  updateVariant(i, "price", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) =>
                  updateVariant(i, "stock", e.target.value)
                }
                required
              />
            </div>

            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="text-red-600 mt-2"
            >
              Remove variant
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="mt-4 border px-3 py-1"
        >
          + Add Variant
        </button>

        {/* IMAGES */}
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="mt-6"
        />

        <button type="submit" disabled={loading} className="mt-6">
          {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </DashboardLayout>
  );
}

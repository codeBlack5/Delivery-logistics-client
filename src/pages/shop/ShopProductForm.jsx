import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import BackButton from "../../components/BackButton";
import api from "../../api/client";

const initialForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  stock_quantity: "",
  active: true,
};

export default function ShopProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true);
        setError("");

        const categoriesResponse = await api.get("/shop/categories");
        setCategories(categoriesResponse.data.categories || []);

        if (isEditing) {
          const productsResponse = await api.get("/shop_management/products");
          const products = productsResponse.data.products || [];
          const product = products.find(
            (item) => String(item.id) === String(id),
          );

          if (!product) {
            setError("Product not found.");
            return;
          }

          setForm({
            category_id: product.category?.id || "",
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            stock_quantity: product.stock_quantity ?? "",
            active: product.active,
          });

          setExistingImages(product.images || []);
        }
      } catch (err) {
        console.error("Failed to load product form:", err);
        setError(
          err.response?.data?.error ||
            "Unable to load the product form.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    setSelectedImages((current) => [...current, ...files]);

    event.target.value = "";
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();

      payload.append("category_id", form.category_id);
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("stock_quantity", form.stock_quantity);
      payload.append("active", form.active ? "true" : "false");

      selectedImages.forEach((image) => {
        payload.append("images[]", image);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditing) {
        await api.patch(`/shop_management/products/${id}`, payload, config);
      } else {
        await api.post("/shop_management/products", payload, config);
      }

      navigate("/shop/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      setError(
        err.response?.data?.errors?.join(", ") ||
          err.response?.data?.error ||
          "Unable to save the product.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <BackButton fallback="/shop/products" />

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F59E0B]">
            Shop Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#082F49]">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {isEditing
              ? "Update the details of this product."
              : "Add a product to your shop catalogue."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading product...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder="e.g. Dining Table"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder="Describe your product..."
                />
              </div>

              <div>
                <label
                  htmlFor="category_id"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <select
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Price (KES)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder="25000"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="images"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Product Images
                </label>

                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#0F3D5E] file:px-4 file:py-2 file:font-semibold file:text-white"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Select one or more JPG, PNG, or WEBP images.
                </p>

                {existingImages.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Existing Images
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.id}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={image.url}
                            alt="Product"
                            className="h-28 w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      New Images
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {selectedImages.map((image, index) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            className="h-28 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-red-700 shadow-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock_quantity"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Stock Quantity
                </label>

                <input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
                  placeholder="10"
                />
              </div>

              <div className="flex items-center gap-3 sm:pt-8">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <label
                  htmlFor="active"
                  className="text-sm font-semibold text-slate-700"
                >
                  Product is active
                </label>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/shop/products")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

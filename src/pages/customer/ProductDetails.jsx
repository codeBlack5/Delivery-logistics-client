import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

import AppNavbar from "../../components/AppNavbar";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/shop/products/${id}`);
        const loadedProduct = response.data.product;

        setProduct(loadedProduct);
        setSelectedImage(loadedProduct.images?.[0] || null);
      } catch (err) {
        console.error("Failed to load product:", err);

        setError(
          err.response?.data?.error ||
            "Unable to load this workshop product.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function addToCart() {
    try {
      setAddingToCart(true);
      setError("");

      await api.post("/cart/items", {
        product_id: product.id,
        quantity: 1,
      });

      navigate("/customer/cart");
    } catch (err) {
      console.error("Failed to add product to cart:", err);

      setError(
        err.response?.data?.error ||
          "Unable to add this product to your cart.",
      );
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppNavbar />

        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-[#082F49]">
              Loading product...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load the product details.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AppNavbar />

        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-700">
              {error || "Product not found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/customer/shop")}
              className="mt-5 rounded-lg bg-[#0F3D5E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#082F49]"
            >
              Back to shop
            </button>
          </div>
        </section>
      </main>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNavbar />

      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/customer/shop")}
          className="mb-5 text-sm font-semibold text-[#0F3D5E] transition hover:text-[#F59E0B]"
        >
          ← Back to shop
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="bg-slate-100 p-5 sm:p-6">
              <div className="flex h-[22rem] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:h-[26rem] sm:p-7">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0F3D5E] text-5xl font-bold text-[#FBBF24] shadow-lg">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 bg-white p-1 transition ${
                        selectedImage?.id === image.id
                          ? "border-[#F59E0B]"
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={product.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F59E0B]">
                {product.category?.name || "Workshop"}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#082F49] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-bold text-[#082F49]">
                {formatPrice(product.price)}
              </p>

              <div
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  inStock
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {inStock
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </div>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#082F49]">
                  Product description
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.description ||
                    "This is a workshop-made product. Contact us for more information about this item."}
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  disabled={!inStock || addingToCart}
                  onClick={addToCart}
                  className="w-full rounded-xl bg-[#F59E0B] px-5 py-3.5 text-sm font-bold text-[#082F49] shadow-sm transition hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {!inStock
                    ? "Out of stock"
                    : addingToCart
                      ? "Adding to cart..."
                      : "Add to cart"}
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                Your item will be added to your shopping cart.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatPrice(price) {
  const amount = Number(price);

  if (Number.isNaN(amount)) {
    return price;
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(amount);
}
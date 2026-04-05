import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../features/product/productSlice";
import { useParams } from "react-router-dom";
import AddToCart from "../components/cart/AddToCart";
import ReviewList from "../components/reviews/ReviewList";
import AddReview from "../components/reviews/AddReview";
import useCanReview from "../hooks/useCanReview";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((s) => s.product);

  const [variantId, setVariantId] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(false);

  const canReview = useCanReview(product?._id);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [ id]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setVariantId(product.variants[0]._id);
    }
  }, [product]);
  useEffect(() => {
  if (!product || product._id !== id) {
    dispatch(fetchProduct(id));
  }
}, [id]);

  if (loading)
    return <p className="p-6 text-center">Loading product...</p>;
  if (!product)
    return <p className="p-6 text-center">Product not found</p>;

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/600x400?text=No+Image" }];

  const selectedVariant = product.variants?.find(
    (v) => v._id === variantId
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      {/* ===== MAIN PRODUCT SECTION ===== */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 grid md:grid-cols-2 gap-6">

        {/* IMAGE SECTION */}
        <div>
          <Swiper modules={[Navigation]} navigation>
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={`${product.name}-${i}`}
                  className="w-full h-80 object-contain rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col gap-3">

          <h1 className="text-2xl font-semibold">
            {product.name}
          </h1>

          {/* RATING */}
          <p className="text-green-600 font-medium">
            ⭐ {product.rating || 0} Ratings
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">
              ₹{selectedVariant?.price || product.price}
            </span>
            <span className="text-gray-400 line-through">
              ₹{(selectedVariant?.price || product.price) + 500}
            </span>
            <span className="text-green-600 text-sm">
              20% off
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Inclusive of all taxes
          </p>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold mb-1">
              Product Description
            </h3>

            <p className={!showFullDesc ? "line-clamp-4 text-gray-700" : "text-gray-700"}>
              {product.description}
            </p>

            {product.description?.length > 200 && (
              <button
                className="text-blue-600 text-sm mt-1"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium mb-1">
                Select Variant
              </label>

              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {product.variants.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.size} | {v.color} | ₹{v.price}
                  </option>
                ))}
              </select>

              {selectedVariant && (
                <p className="text-sm mt-2 text-gray-600">
                  Selected:{" "}
                  <strong>{selectedVariant.size}</strong>,{" "}
                  <strong>{selectedVariant.color}</strong>
                </p>
              )}
            </div>
          )}

          {/* ADD TO CART */}
          <div className="mt-2">
            <AddToCart
              productId={product._id}
              variantId={variantId}
            />
          </div>
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <div className="max-w-6xl mx-auto mt-6 bg-white p-4 rounded-xl shadow-md">

        {isAuthenticated && canReview && (
          <AddReview
            productId={product._id}
            onSuccess={() => setRefreshReviews((p) => !p)}
          />
        )}

        <ReviewList
          productId={product._id}
          refresh={refreshReviews}
        />
      </div>
    </div>
  );
}

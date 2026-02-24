import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../features/product/productSlice";
import { useParams } from "react-router-dom";
import AddToCart from "../components/cart/AddToCart";
import ReviewList from "../components/reviews/ReviewList";
import AddReview from "../components/reviews/AddReview";
import useCanReview from "../hooks/useCanReview";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

/* Swiper styles */
import "swiper/css";
import "swiper/css/navigation";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((s) => s.product);

  const [variantId, setVariantId] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(false);

  // ✅ SAFE hook usage
  const canReview = useCanReview(product?._id);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setVariantId(product.variants[0]._id);
    }
  }, [product]);

  if (loading) return <p className="p-6 text-center">Loading product...</p>;
  if (!product) return <p className="p-6 text-center">Product not found</p>;

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/600x400?text=No+Image" }];

  const selectedVariant = product.variants?.find(
    (v) => v._id === variantId
  );

  return (
    <div className="product-page">
      {/* ================= PRODUCT CARD ================= */}
      <div className="product-card">
        {/* IMAGE */}
        <div className="product-image-box">
          <Swiper modules={[Navigation]} navigation slidesPerView={1}>
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={`${product.name}-${i}`}
                  className="product-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="product-price">
            ₹{selectedVariant?.price || product.price}
          </p>
          <p className="tax-text">Inclusive of all taxes</p>

          <div className="product-section">
            <h3>Product Description</h3>
            <p className={showFullDesc ? "" : "clamp-4"}>
              {product.description}
            </p>

            {product.description?.length > 300 && (
              <button
                className="link-button"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {product.variants?.length > 0 && (
            <div className="variant-box">
              <label>Select Size & Color</label>

              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
              >
                {product.variants.map((v) => (
                  <option key={v._id} value={v._id}>
                    Size: {v.size} | Color: {v.color} | ₹{v.price}
                  </option>
                ))}
              </select>

              {selectedVariant && (
                <p className="variant-selected">
                  Selected: <strong>{selectedVariant.size}</strong>,{" "}
                  <strong>{selectedVariant.color}</strong>
                </p>
              )}
            </div>
          )}

          <div className="cart-box">
            <AddToCart
              productId={product._id}
              variantId={variantId}
            />
          </div>
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div className="product-reviews">
        {canReview && (
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

import { useEffect, useState } from "react";
import { getProductReviewsAPI } from "../../features/review/reviewApi";

export default function ReviewList({ productId, refresh }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!productId) return;

    getProductReviewsAPI(productId).then((res) => {
      setReviews(res.data || []);
    });
  }, [productId, refresh]); // ✅ now defined

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="review-list">
      <h3>Customer Reviews</h3>

      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <strong>{review.user?.name}</strong>
            <span>⭐ {review.rating}/5</span>
          </div>

          {review.comment && (
            <p className="review-comment">{review.comment}</p>
          )}

          {review.images?.length > 0 && (
            <div className="review-images">
              {review.images.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt="review"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

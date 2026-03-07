import { useEffect, useState } from "react";
import { getProductReviewsAPI } from "../../features/review/reviewApi";

export default function ReviewList({ productId, refresh }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await getProductReviewsAPI(productId);
        setReviews(res.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refresh]);

  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="review-list">
      <h3>Customer Reviews</h3>

      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <strong>{review.user?.name || "User"}</strong>
            <span>⭐ {review.rating}/5</span>
          </div>

          {review.comment && (
            <p className="review-comment">{review.comment}</p>
          )}

          {review.images?.length > 0 && (
            <div className="review-images">
              {review.images.map((img) => (
                <img
                  key={img.public_id || img.url}
                  src={img.url}
                  alt="review"
                  style={{ width: "80px", marginRight: "8px" }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { addReviewAPI } from "../../features/review/reviewApi";
import toast from "react-hot-toast";

export default function AddReview({ productId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    try {
      setLoading(true);
 
      const formData = new FormData();
      formData.append("productId", productId); 
      formData.append("rating", rating);
      formData.append("comment", comment);

      for (let img of images) {
        formData.append("images", img);
      }

      await addReviewAPI(formData);

      toast.success("Review added");
      setComment("");
      setImages([]);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-review">
      <h3>Write a Review</h3>

      <label>Rating</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience"
      />

      <label>Images (optional)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages([...e.target.files])}
      />

      <button disabled={loading} onClick={submitReview}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";

export default function useCanReview(productId) {
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const checkReview = async () => {
      try {
        const res = await api.get("/orders/my");
        const orders = res.data.orders || [];

        const eligible = orders.some((order) =>
          order.items.some(
            (item) =>
              item.product?.toString() === productId &&
              item.status === "DELIVERED"
          )
        );

        setCanReview(eligible);

      } catch (error) {
        console.error("Review eligibility error:", error);
        setCanReview(false);
      }
    };

    checkReview();

  }, [productId]);

  return canReview;
}

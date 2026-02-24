import { useEffect, useState } from "react";
import api from "../services/api";

export default function useCanReview(productId) {
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    api.get("/orders/my").then((res) => {
      const orders = res.data.orders || [];

      const eligible = orders.some((order) =>
        order.items.some(
          (item) =>
            item.product?._id?.toString() === productId &&
            item.status === "DELIVERED"
        )
      );

      setCanReview(eligible);
    });
  }, [productId]);

  return canReview;
}

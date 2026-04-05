import { useEffect, useState } from "react";
import api from "../services/api";

export default function useCanReview(productId) {
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const check = async () => {
      try {
        const res = await api.get("/orders/my");
        const orders = res.data.orders || [];

        const eligible = orders.some((order) =>
          order.items.some((item) => {
            const itemProductId =
              typeof item.product === "object"
                ? item.product._id
                : item.product;

            return (
              itemProductId?.toString() === productId.toString() &&
              item.status === "DELIVERED"
            );
          })
        );

        setCanReview(eligible);
      } catch (err) {
        console.error("canReview error:", err);
        setCanReview(false);
      }
    };

    check();
  }, [productId]);

  return canReview;
}

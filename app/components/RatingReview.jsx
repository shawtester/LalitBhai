// app/components/RatingReview.js
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import MyRating from "./MyRating";

// This is now a Server Component
export default async function RatingReview({ productId }) {
  const counts = await getProductReviewCounts({ productId });
  
  return (
    <div className="flex gap-3 items-center">
      <MyRating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
      </h1>
    </div>
  );
}

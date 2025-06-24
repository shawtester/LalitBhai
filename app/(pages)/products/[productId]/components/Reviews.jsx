"use client";

import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Avatar, Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Reviews({ productId }) {
  const { data } = useReviews({ productId });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please log in first");
      }
      await deleteReview({
        uid: user?.uid,
        productId,
        reviewId, // Assuming deleteReview accepts this parameter to identify the review
      });
      toast.success("Successfully deleted");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.map((item, index) => (
          <div
            key={item?.id || `${item?.uid}-${item?.createdAt || index}`}
            className="flex gap-3"
          >
            <div>
              <Avatar src={item?.photoURL} />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-semibold">{item?.displayName}</h1>
                  <Rating value={item?.rating} readOnly size="small" />
                </div>
                {user?.uid === item?.uid && (
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="flat"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => handleDelete(item?.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-700 pt-1">{item?.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useReviews } from "@/lib/firestore/addingreviews/read";
import { deleteReview } from "@/lib/firestore/addingreviews/write";

export default function ListView() {
  const { reviews, isLoading, error } = useReviews();

  if (isLoading) {
    return <div><CircularProgress /></div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <h1 className="text-xl">Reviews</h1>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">SN</th>
            <th className="font-semibold border-y bg-white px-3 py-2">Name</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Date</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Rating</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Product</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Comment</th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, index) => (
            <Row key={item.id} index={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteReview({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error("Error deleting review");
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/reviews?id=${item?.id}`);
  };

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y bg-white px-3 py-2">{item?.name}</td>
      <td className="border-y bg-white px-3 py-2">{item?.date}</td>
      <td className="border-y bg-white px-3 py-2">{item?.rating}</td>
      <td className="border-y bg-white px-3 py-2">{item?.product}</td>
      <td className="border-y bg-white px-3 py-2">{item?.comment}</td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button onClick={handleUpdate} isDisabled={isDeleting} isIconOnly size="sm">
            <Edit2 size={13} />
          </Button>
          <Button onClick={handleDelete} isLoading={isDeleting} isDisabled={isDeleting} isIconOnly size="sm" color="danger">
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

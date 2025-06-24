// app/admin/writereviews.jsx
"use client";

import { useState } from "react";
import { writeReview } from "@/lib/firestore/addingreviews/write";

export default function WriteReviews() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(5); // Default rating
  const [comment, setComment] = useState("");
  const [product, setProduct] = useState(""); // Allow admin to write the product name manually

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      name,
      date,
      rating,
      comment,
      product,
    };

    await writeReview(reviewData);

    // Reset the form
    setName("");
    setDate("");
    setRating(5);
    setComment("");
    setProduct("");

    alert("Review added successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Add a Review</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={star <= rating ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  <path d="M12 2l3.4 6.8 7.6.6-5.6 5.2 1.2 7.6-6.4-3.6-6.4 3.6 1.2-7.6-5.6-5.2 7.6-.6z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

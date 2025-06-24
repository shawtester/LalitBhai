// app/reviews/page.js
"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { readReviews } from "@/lib/firestore/addingreviews/read";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsData = await readReviews();
      setReviews(reviewsData);
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-yellow-50 to-green-50">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Customer Testimonials
        </h1>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-lg shadow-lg border-2 border-transparent hover:border-pink-400 hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:-translate-y-2"
                style={{
                  background:
                    review.product === "Whey Protein"
                      ? "linear-gradient(135deg, #FFDDC1, #FF9A76)"
                      : "linear-gradient(135deg, #B2F9FC, #82D8D8)",
                }}
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-red-400 flex items-center justify-center text-white font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold mt-2">{review.name}</h2>
                  <span className="text-xs text-gray-400">{review.date}</span>
                  <span className="text-sm italic text-gray-600">
                    {review.product}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2 justify-center">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating ? "text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

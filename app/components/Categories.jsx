"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fetch categories with real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const updatedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(updatedCategories);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = `/categories/${categoryId}`;
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-blue-200 overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="bubble-container">
          <div className="bubble bubble1"></div>
          <div className="bubble bubble2"></div>
          <div className="bubble bubble3"></div>
          <div className="bubble bubble4"></div>
          <div className="bubble bubble5"></div>
        </div>
      </div>

      <div
        ref={sectionRef}
        className={`transition-opacity transition-transform duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5 mt-5 mb-10`}
      >
        <div className="flex justify-center w-full">
          <h1 className="text-3xl font-extrabold tracking-wide md:text-4xl">
            <span className="text-yellow-600 font-bold">Shop By</span>
            <span className="text-black font-bold"> Category</span>
          </h1>
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="loading">
              <svg width="128px" height="96px">
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="back"
                ></polyline>
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  id="front"
                ></polyline>
              </svg>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id || `category-${index}`}
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer group bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col gap-3 items-center justify-center p-4">
                <div className="w-full h-[200px] sm:h-[50px] lg:h-[250px] overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out">
                  <img
                    src={category.imageURL}
                    alt={category.name || "Category"}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-bold text-lg text-gray-700 text-center mt-2 group-hover:text-yellow-600 transition-colors duration-300">
                  {category.name}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

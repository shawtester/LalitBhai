"use client";
import { useState, useEffect } from "react";

export default function Photos({ imageList }) {
  // Ensure that the imageList is available and has at least two images (to avoid issues with index 1)
  const [selectedImage, setSelectedImage] = useState(imageList[1] || imageList[0]);

  useEffect(() => {
    // If the imageList changes, update the selectedImage accordingly
    if (imageList && imageList.length > 0) {
      setSelectedImage(imageList[1] || imageList[0]); // Default to image at index 1 or 0 if not available
    }
  }, [imageList]);

  if (!imageList || imageList.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main image section */}
      <div className="flex justify-center w-full">
        <img
          className="object-cover h-[350px] md:h-[430px]"
          src={selectedImage}
          alt="Main Image"
        />
      </div>

      {/* Thumbnail images section */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        {imageList.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(item)} // Update the main image when thumbnail is clicked
            className={`w-[80px] border rounded p-2 cursor-pointer ${
              item === selectedImage ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <img className="object-cover" src={item} alt={`Thumbnail ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

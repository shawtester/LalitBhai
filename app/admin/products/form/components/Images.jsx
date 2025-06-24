"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

export default function Images({
  data,
  imageList,
  setImageList,
}) {
  const [loading, setLoading] = useState(false);

  // Handle image upload to Cloudinary
  const uploadToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "NUTRIBOX"); // Use your Cloudinary preset
    formData.append("public_id", `${data?.id}_image_${Date.now()}`); // Unique public ID based on product ID and timestamp
    formData.append("tags", `product_id_${data?.id}`); // Add tags to associate with product ID

    try {
      setLoading(true); // Set loading to true while uploading
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dzk0kk3gh/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );

      const imageUrl = response.data.secure_url; // Get the URL of the uploaded image
      setImageList((prevList) => [...prevList, imageUrl]); // Add the new image to the list

      toast.success("Image uploaded successfully!"); // Show success message
    } catch (error) {
      // Enhanced error logging
      console.error("Error uploading image:", error?.response?.data || error.message || error);

      const errorMessage = error?.response?.data?.message || error.message || "Something went wrong!";
      toast.error(`Error uploading image: ${errorMessage}`); // Show the specific error message
    } finally {
      setLoading(false); // Set loading to false after upload
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadToCloudinary(file);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex gap-3">
        <label className="block text-sm font-medium text-gray-900" htmlFor="imageList">
          Additional Images
        </label>
        <input
          type="file"
          accept="image/*"
          id="imageList"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
        <Button as="label" htmlFor="imageList" isLoading={loading} disabled={loading}>
          Upload More Images
        </Button>
      </div>

      <div className="mt-4">
        <h3>Uploaded Images</h3>
        <ul>
          {imageList?.map((image, index) => (
            <li key={index}>
              <img src={image} alt={`Image ${index}`} className="w-32 h-32 object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

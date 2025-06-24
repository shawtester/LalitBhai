"use client";

import { getCategory } from "@/lib/firestore/categories/read_server";
import {
  createNewCategory,
  updateCategory,
} from "@/lib/firestore/categories/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import imageCompression from "browser-image-compression"; // Import image compression library

export default function Form() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getCategory({ id: id });
      if (!res) {
        toast.error("Category Not Found!");
      } else {
        setData(res);
        setImageURL(res?.imageURL);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((preData) => {
      return {
        ...(preData ?? {}),
        [key]: value,
      };
    });
  };

  const handleImageUpload = async (imageFile) => {
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (imageFile.size > maxFileSize) {
      toast.error("File size exceeds the 10 MB limit. Please upload a smaller image.");
      return;
    }

    try {
      // Compression options
      const options = {
        maxSizeMB: 1, // Compress to 1 MB or less
        maxWidthOrHeight: 1000, // Max width or height
        useWebWorker: true, // Use web worker for faster compression
      };

      // Compress image
      const compressedFile = await imageCompression(imageFile, options);
      toast.success("Image compressed successfully");

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "NUTRIBOX");
      formData.append("folder", "categories");

      console.log("FormData entries:", [...formData.entries()]);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dzk0kk3gh/image/upload`,
        formData
      );

      const uploadedImageUrl = response.data.secure_url;
      setImageURL(uploadedImageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error object:", error);
      console.error("Error response data:", error.response?.data || "No response data");
      toast.error("Error uploading image");
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewCategory({ data: { ...data, imageURL } });
      toast.success("Successfully Created");
      setData(null);
      setImageURL(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateCategory({ data: { ...data, imageURL } });
      toast.success("Successfully Updated");
      setData(null);
      setImageURL(null);
      router.push(`/admin/categories`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Category</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="category-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            name="category-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => {
              handleData("name", e.target.value);
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category-slug" className="text-gray-500 text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="category-slug"
            name="category-slug"
            type="text"
            value={data?.slug ?? ""}
            onChange={(e) => {
              handleData("slug", e.target.value);
            }}
            placeholder="Enter Slug"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category-image" className="text-gray-500 text-sm">
            Image (optional)
          </label>
          {imageURL && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={imageURL} alt="Category" />
            </div>
          )}
          <input
            id="category-image"
            name="category-image"
            type="file"
            accept="image/*"
            className="border px-4 py-2 rounded-lg w-full"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}

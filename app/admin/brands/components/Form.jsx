"use client";

import { getBrand } from "@/lib/firestore/brands/read_server";
import { createNewBrand, updateBrand } from "@/lib/firestore/brands/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Import Axios for Cloudinary upload

export default function Form() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null); // State for image file

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getBrand({ id: id });
      if (!res) {
        toast.error("Brand Not Found!");
      } else {
        setData(res);
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

  // Cloudinary image upload function
  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "NUTRIBOX"); // Replace with your preset
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dzk0kk3gh/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );
      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image to Cloudinary");
      return null;
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      if (!data?.name) {
        toast.error("Brand name is required");
        return;
      }

      await createNewBrand({ data: { ...data, imageURL: imageUrl } });
      toast.success("Successfully Created");
      setData(null);
      setImage(null); // Clear image state after successful creation
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let imageUrl = data?.imageURL; // Keep the existing image URL if no new image is uploaded
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      if (!data?.name) {
        toast.error("Brand name is required");
        return;
      }

      await updateBrand({ data: { ...data, imageURL: imageUrl } });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null); // Clear image state after successful update
      router.push(`/admin/brands`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Brand</h1>
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
        {/* Brand Name Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="brand-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>{" "}
          </label>
          <input
            id="brand-name"
            name="brand-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => {
              handleData("name", e.target.value);
            }}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        {/* Image Upload Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="brand-image" className="text-gray-500 text-sm">
            Upload Image
          </label>
          <input
            type="file"
            id="brand-image"
            name="brand-image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border px-4 py-2 rounded-lg w-full"
          />
          {image && (
            <div className="mt-2">
              <p>Selected image: {image.name}</p>
            </div>
          )}
        </div>

        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}

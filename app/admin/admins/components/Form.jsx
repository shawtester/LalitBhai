"use client";
import { useForm } from "react-hook-form";
import { getAdmin } from "@/lib/firestore/admins/read_server";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Import Axios

export default function Form() {
  const { register, handleSubmit, setValue } = useForm();
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getAdmin({ id: id });
      if (!res) {
        toast.error("Admin Not Found!");
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
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0]; // Get the uploaded image
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "NUTRIBOX"); // Your Cloudinary upload preset

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dzk0kk3gh/image/upload`, // Your Cloudinary cloud name
          formData
        );
        setImageUrl(response.data.secure_url); // Set the image URL after upload
        setValue("profile", response.data.secure_url); // Optionally set it as form data if needed
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Error uploading image");
      }
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewAdmin({ data: { ...data, imageURL: imageUrl } }); // Include image URL
      toast.success("Successfully Created");
      setData(null);
      setImageUrl(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateAdmin({ data: { ...data, imageURL: imageUrl } }); // Include image URL
      toast.success("Successfully Updated");
      setData(null);
      setImageUrl(null);
      router.push(`/admin/admins`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Admin</h1>
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
        {/* Image Upload Section */}
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          {imageUrl && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={imageUrl} alt="Admin" />
            </div>
          )}
          <input
            onChange={handleImageUpload}
            id="admin-image"
            name="admin-image"
            type="file"
            className="border px-4 py-2 rounded-lg w-full"
            required
          />
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="admin-name"
            name="admin-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-email" className="text-gray-500 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="admin-email"
            name="admin-email"
            type="email"
            placeholder="Enter Email"
            value={data?.email ?? ""}
            onChange={(e) => handleData("email", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}

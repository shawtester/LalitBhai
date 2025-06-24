"use client";

import { useState, useEffect } from "react";
import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";
import axios from "axios";
import toast from "react-hot-toast";

export default function BasicDetails({ data, handleData }) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const [isFeatured, setIsFeatured] = useState(data?.isFeatured ?? "no");
  const [flavors, setFlavors] = useState(data?.flavors ?? [{ name: "" }]);
  const [weights, setWeights] = useState(
    data?.weights ?? [{ weight: "", price: "", salePrice: "", imageUrl: [] }]
  );
  const [stock, setStock] = useState(data?.isInStock ?? 0);
  const [vegType, setVegType] = useState(data?.vegType ?? "veg");

  useEffect(() => {
    setIsFeatured(data?.isFeatured ?? "no");
    setFlavors(data?.flavors ?? [{ name: "" }]);
    setWeights(data?.weights ?? [{ weight: "", price: "", salePrice: "", imageUrl: [] }]);
    setStock(data?.isInStock ?? 0);
    setVegType(data?.vegType ?? "veg");
  }, [data]);

  const handleFeaturedChange = (e) => {
    const newFeaturedStatus = e.target.value;
    setIsFeatured(newFeaturedStatus);
    handleData("isFeatured", newFeaturedStatus);
  };

  const handleStockChange = (e) => {
    const newStock = parseInt(e.target.value, 10);
    setStock(newStock);
    handleData("isInStock", newStock);
  };

  const handleVegTypeChange = (e) => {
    const newVegType = e.target.value;
    setVegType(newVegType);
    handleData("vegType", newVegType);
  };

  const handleFlavorChange = (index, value) => {
    const updatedFlavors = [...flavors];
    updatedFlavors[index].name = value;
    setFlavors(updatedFlavors);
    handleData("flavors", updatedFlavors);
  };

  const handleWeightChange = (index, field, value) => {
    const updatedWeights = [...weights];
    updatedWeights[index][field] = value;
    setWeights(updatedWeights);
    handleData("weights", updatedWeights);
  };

  const uploadToCloudinary = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "NUTRIBOX");
    formData.append("public_id", `${data?.id}_weight_image_${index}_${Date.now()}`);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dzk0kk3gh/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;

      const updatedWeights = [...weights];
      updatedWeights[index].imageUrl.push(imageUrl); // Add new image URL
      setWeights(updatedWeights);
      handleData("weights", updatedWeights);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error?.response?.data || error.message);
      toast.error("Error uploading image. Please try again.");
    }
  };

  const handleImageChange = (index, e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Loop through selected files and upload each one
      Array.from(files).forEach((file) => uploadToCloudinary(file, index));
    }
  };

  const addFlavor = () => {
    setFlavors([...flavors, { name: "" }]);
  };

  const removeFlavor = (index) => {
    const updatedFlavors = flavors.filter((_, i) => i !== index);
    setFlavors(updatedFlavors);
    handleData("flavors", updatedFlavors);
  };

  const addWeight = () => {
    setWeights([...weights, { weight: "", price: "", salePrice: "", imageUrl: [] }]);
  };

  const removeWeight = (index) => {
    const updatedWeights = weights.filter((_, i) => i !== index);
    setWeights(updatedWeights);
    handleData("weights", updatedWeights);
  };

  return (
    <section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
      <h1 className="font-semibold text-lg">Basic Details</h1>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-title">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Title"
          id="product-title"
          name="product-title"
          value={data?.title ?? ""}
          onChange={(e) => handleData("title", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-short-description">
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Short Description"
          id="product-short-description"
          name="product-short-description"
          value={data?.shortDescription ?? ""}
          onChange={(e) => handleData("shortDescription", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-brand">
          Brand <span className="text-red-500">*</span>
        </label>
        <select
          id="product-brand"
          name="product-brand"
          value={data?.brandId ?? ""}
          onChange={(e) => handleData("brandId", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="">Select Brand</option>
          {brands?.map((item) => (
            <option value={item?.id} key={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-category">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="product-category"
          name="product-category"
          value={data?.categoryId ?? ""}
          onChange={(e) => handleData("categoryId", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((item) => (
            <option value={item?.id} key={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-stock">
          In Stock <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="product-stock"
          name="product-stock"
          value={stock}
          onChange={handleStockChange}
          placeholder="Enter Stock Quantity"
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-is-featured-product">
          Is Featured Product <span className="text-red-500">*</span>
        </label>
        <select
          id="product-is-featured-product"
          name="product-is-featured-product"
          value={isFeatured}
          onChange={handleFeaturedChange}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-bold text-gray-500 text-xs" htmlFor="product-veg-type">
          Veg / Non-Veg <span className="text-red-500">*</span>
        </label>
        <select
          id="product-veg-type"
          name="product-veg-type"
          value={vegType}
          onChange={handleVegTypeChange}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="font-bold">Flavors</h2>
        {flavors.map((flavor, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={flavor.name}
              onChange={(e) => handleFlavorChange(index, e.target.value)}
              placeholder="Flavor Name"
              className="border px-4 py-2 rounded-lg w-full outline-none"
            />
            <button type="button" onClick={() => removeFlavor(index)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addFlavor} className="bg-blue-500 text-white py-2 rounded-lg w-full mt-4">
          Add Flavor
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="font-bold">Weights & Prices</h2>
        {weights.map((weight, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={weight.weight}
                onChange={(e) => handleWeightChange(index, "weight", e.target.value)}
                placeholder="Weight (kg)"
                className="border px-4 py-2 rounded-lg w-full outline-none"
              />
              <input
                type="number"
                value={weight.price}
                onChange={(e) => handleWeightChange(index, "price", e.target.value)}
                placeholder="Price"
                className="border px-4 py-2 rounded-lg w-full outline-none"
              />
              <input
                type="number"
                value={weight.salePrice}
                onChange={(e) => handleWeightChange(index, "salePrice", e.target.value)}
                placeholder="Sale Price"
                className="border px-4 py-2 rounded-lg w-full outline-none"
              />
              <button type="button" onClick={() => removeWeight(index)} className="text-red-500">
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {weight.imageUrl?.map((image, imgIndex) => (
                <div key={imgIndex} className="w-full p-2">
                  <img
                    src={image}
                    alt={`Weight ${index} Image ${imgIndex}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                className="border px-4 py-2 rounded-lg w-full outline-none"
                multiple
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addWeight} className="bg-blue-500 text-white py-2 rounded-lg w-full mt-4">
          Add Weight
        </button>
      </div>
    </section>
  );
}

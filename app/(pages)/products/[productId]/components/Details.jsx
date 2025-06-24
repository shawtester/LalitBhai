"use client";

import { useState, useEffect } from "react";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import AuthContextProvider from "@/context/AuthContext";

export default function Details({ product }) {
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
  };

  const [selectedWeight, setSelectedWeight] = useState(product?.weights[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors[0]);
  const [price, setPrice] = useState(product?.weights[0]?.salePrice || product?.weights[0]?.price);

  useEffect(() => {
    if (selectedWeight) {
      setPrice(selectedWeight.salePrice || selectedWeight.price);
    }
  }, [selectedWeight, selectedFlavor]);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Category and Brand Section */}
      <div className="flex gap-4 mt-5">
        <Category categoryId={product?.categoryId} />
        <Brand brandId={product?.brandId} />
      </div>

      {/* Product Title and Description */}
      <h1 className="font-semibold text-xl md:text-3xl">{product?.title}</h1>
      <h2 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
        {product?.shortDescription}
      </h2>

      {/* Price Section with Attractive Styling */}
      <div className="flex gap-3 items-center mt-3 bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-50 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col items-start">
          <h3 className="text-3xl font-bold text-green-500">
            ₹ {price}
            {selectedWeight?.salePrice && (
              <>
                <span className="text-lg line-through text-gray-600 ml-2">
                  ₹ {selectedWeight?.price}
                </span>
                <span className="text-sm text-yellow-500 bg-red-600 px-2 py-1 rounded-full ml-2">
                  {((1 - price / selectedWeight?.price) * 100).toFixed(0)}% OFF
                </span>
              </>
            )}
          </h3>
          {selectedWeight?.salePrice && (
            <span className="text-xs text-gray-500 mt-1">
              Hurry, offer valid for a limited time!
            </span>
          )}
        </div>
        {/* Sale Icon */}
        <div className="flex items-center justify-center">
          <img
            src="/offer.png" 
            alt="Sale"
            className="h-20 w-20 ml-4 animate-pulse"
          />
        </div>
      </div>

      {/* Weight and Flavor Selection Section with Light Background Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Weight Selection */}
        <div className="flex flex-col gap-2 bg-indigo-50 p-4 rounded-lg shadow-sm">
          <label className="text-lg font-semibold text-gray-700">Select Weight:</label>
          <div className="flex gap-2 flex-wrap">
            {product?.weights.map((weightOption) => (
              <button
                key={weightOption.weight}
                onClick={() => setSelectedWeight(weightOption)}
                className={`border-2 rounded-full px-5 py-2 text-lg font-semibold transition duration-300 ease-in-out transform ${
                  selectedWeight?.weight === weightOption.weight
                    ? "bg-indigo-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-indigo-600 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                }`}
              >
                {weightOption.weight} kg
              </button>
            ))}
          </div>
        </div>

        {/* Flavor Selection with Light Background Color */}
        <div className="flex flex-col gap-2 bg-teal-50 p-4 rounded-lg shadow-sm">
          {product?.flavors?.length > 0 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="flavors" className="text-lg font-semibold text-gray-700">Flavor:</label>
              <div className="flex gap-2 flex-wrap">
                {product.flavors.map((flavor) => (
                  <button
                    key={flavor.name}
                    onClick={() => handleFlavorChange(flavor)}
                    className={`border-2 rounded-full px-5 py-2 text-lg font-semibold transition duration-300 ease-in-out transform ${
                      selectedFlavor?.name === flavor.name
                        ? "bg-teal-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-teal-600 hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                    }`}
                  >
                    {flavor.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex items-center gap-4 w-full mt-4">
        <AuthContextProvider>
          <AddToCartButton
            productId={product?.id}
            selectedWeight={selectedWeight}
            selectedFlavor={selectedFlavor}
            price={selectedWeight?.price}
            salePrice={selectedWeight?.salePrice}
          />
        </AuthContextProvider>
      </div>

      {/* Out of Stock Notice */}
      {product?.stock <= (product?.orders ?? 0) && (
        <div className="flex mt-4">
          <h3 className="text-red-500 py-1 rounded-lg text-sm font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}

      {/* Product Description */}
      <div className="flex flex-col gap-2 py-2">
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
        ></div>
      </div>
    </div>
  );
}

function Category({ categoryId }) {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      const categoryData = await getCategory({ id: categoryId });
      setCategory(categoryData);
    }
    fetchCategory();
  }, [categoryId]);

  if (!category) return <div>Loading...</div>;

  return (
    <Link href={`/categories/${categoryId}`}>
      <div className="flex items-center gap-3 border-2 border-indigo-300 bg-indigo-50 px-4 py-2 rounded-full shadow-md hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105">
        <img className="h-8 w-8 rounded-full" src={category?.imageURL} alt={category?.name} />
        <h4 className="text-lg font-semibold text-indigo-800">{category?.name}</h4>
      </div>
    </Link>
  );
}

function Brand({ brandId }) {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    async function fetchBrand() {
      const brandData = await getBrand({ id: brandId });
      setBrand(brandData);
    }
    fetchBrand();
  }, [brandId]);

  if (!brand) return <div>Loading...</div>;

  return (
    <div className="flex items-center gap-3 border-2 border-teal-300 bg-teal-50 px-4 py-2 rounded-full shadow-md hover:bg-teal-100 transition duration-300 ease-in-out transform hover:scale-105">
      <img className="h-8 w-8 rounded-full" src={brand?.imageURL} alt={brand?.name} />
      <h4 className="text-lg font-semibold text-teal-800">{brand?.name}</h4>
    </div>
  );
}

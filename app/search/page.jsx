"use client";

import React, { useState } from "react";
import { searchProducts } from "@/lib/firestore/searchProducts/page";
import ProductsGridView from "@/app/components/Products";
import { FaSearch } from "react-icons/fa"; // For search icon
import Header from "../components/Header";
import Footer from "../components/Footer";
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      setLoading(true);
      const searchResults = await searchProducts(term);
      setResults(searchResults);
      setLoading(false);
    } else {
      setResults([]); // Clear results if search term is empty.
    }
  };

  return (

    <>
    <Header/>
 
    <div className="min-h-screen bg-gradient-to-t from-green-100 via-green-200 to-white flex flex-col items-center">
      {/* Hero Section */}
      <div
        className={`relative w-full ${isFocused ? "h-[120px]" : "h-[300px]"} bg-cover bg-center rounded-lg mb-10 transition-all duration-300 ease-in-out`}
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-3xl text-white font-bold text-center">
            Find Your Perfect Supplement
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/2 lg:w-1/3 mb-8">
        <input
          type="text"
          placeholder="Search for supplements..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full p-4 text-lg rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out ${isFocused ? "w-full" : "w-3/4"}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <FaSearch />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner-border text-green-500 mb-6" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {/* Search Results */}
      <div className="w-full max-w-7xl">
        {results.length > 0 ? (
          <ProductsGridView products={results} />
        ) : (
          searchTerm && !loading && (
            <p className="text-xl text-gray-600 text-center">
              No results found for <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )
        )}
      </div>

      {/* Floating Search Button */}
      <div className="fixed bottom-8 right-8 bg-green-500 p-4 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-all">
        <FaSearch className="text-white text-2xl" />
      </div>
    </div>

    <Footer/>
    
  </>
  );
};

export default SearchPage;

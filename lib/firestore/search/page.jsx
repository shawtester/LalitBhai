// app/lib/firestore/search/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase'; // Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return; // Avoid search if no term is entered
    
    setLoading(true);
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("name", ">=", searchTerm),  // Case-insensitive search
        where("name", "<=", searchTerm + '\uf8ff')  // Match products that start with search term
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => doc.data());
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();  // Optional: automatically search when page loads (you can adjust this based on your needs)
  }, [searchTerm]); // Run search every time the search term changes

  return (
    <div>
      <h1>Product Search</h1>
      <input 
        type="text" 
        placeholder="Search for a product..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchPage;

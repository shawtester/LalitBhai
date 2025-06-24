import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firebase import
import { collection, query, orderBy, limit, getDocs,where,getFirestore } from "firebase/firestore";


export function useAllOrders({ pageLimit = 10 }) {
  const [data, setData] = useState([]); // Store orders data
  const [error, setError] = useState(null); // Store any error message
  const [isLoading, setIsLoading] = useState(true); // Handle loading state

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Define the base query for fetching orders
        const ordersQuery = query(
          collection(db, "finalorder"),
          orderBy("createdAt", "desc"),
          limit(pageLimit) // Limit the number of orders returned
        );

        // Execute the query and fetch the documents
        const querySnapshot = await getDocs(ordersQuery);

        // Map the fetched documents to include their ID and data
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the fetched orders
        setData(ordersList);
      } catch (err) {
        // Handle any errors
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [pageLimit]); // Trigger useEffect when pageLimit changes

  return { data, error, isLoading }; // Return data, error, and loading state
}






// app/lib/firestore/orders/read.jsx





export const fetchOrders = async (userId) => {
  const db = getFirestore();
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));
  
  const ordersSnapshot = await getDocs(q);
  const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return orders;
};


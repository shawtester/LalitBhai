
import { collection, getDocs, query, onSnapshot  } from "firebase/firestore";

import { useState, useEffect } from "react";
import { db } from "../../firebase";


// Function to fetch all reviews from Firestore
export const readReviews = async () => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const querySnapshot = await getDocs(reviewsCollection);
    const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reviews;
  } catch (e) {
    console.error("Error fetching reviews: ", e);
    return [];
  }
};



// Custom hook for fetching reviews in real-time
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reviewsCollection = collection(db, "reviews");
    const q = query(reviewsCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching reviews: ", error);
      setError(error);
      setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return { reviews, isLoading, error };
};

// lib/firestore/Managereviews/write.jsx
import { db } from "../../firebase";
import { collection, addDoc ,doc,deleteDoc} from "firebase/firestore";

// Function to add a new review to Firestore





// Function to add a new review to Firestore
export const writeReview = async (reviewData) => {
    try {
      const reviewsCollection = collection(db, "reviews");
      const docRef = await addDoc(reviewsCollection, reviewData);
      console.log("Review added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding review: ", e);
    }
  };
  
  // Function to delete a review from Firestore
  export const deleteReview = async ({ id }) => {
    try {
      const reviewDoc = doc(db, "reviews", id);
      await deleteDoc(reviewDoc);
    } catch (e) {
      console.error("Error deleting review: ", e);
      throw new Error("Error deleting review");
    }
  };
  

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this path to your Firebase configuration file

export async function writeTempOrder(orderData) {
  if (!orderData.transactionId) {
    throw new Error("Transaction ID is required to write order details.");
  }

  try {
    const docRef = doc(db, "temporder", orderData.transactionId);
    await setDoc(docRef, orderData);
    console.log("Order data saved successfully in temporder:", orderData);
  } catch (error) {
    console.error("Error saving order data to temporder:", error);
    throw error;
  }
}

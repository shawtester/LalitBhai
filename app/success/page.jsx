"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, query, where, collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientTransactionId = searchParams.get("clientTransactionId");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");
  const details = searchParams.get("details") ? JSON.parse(searchParams.get("details")) : {};

  const [loading, setLoading] = useState(true);
  const [isProcessed, setIsProcessed] = useState(false); // Prevent multiple executions

  useEffect(() => {
    if (clientTransactionId && !isProcessed) {
      setIsProcessed(true);
      fetchAndSaveData();
    }
  }, [clientTransactionId, isProcessed]);

  const fetchAndSaveData = async () => {
    try {
      const db = getFirestore(app);

      // Reference to the orders collection
      const orderDocRef = doc(db, "orders", clientTransactionId);

      // Check if the order already exists
      const existingOrder = await getDoc(orderDocRef);
      if (existingOrder.exists()) {
        console.log("Order already exists. Skipping save.");
        return;
      }

      // Query the temporder collection for the transaction ID
      const tempOrderRef = collection(db, "temporder");
      const tempOrderQuery = query(tempOrderRef, where("transactionId", "==", clientTransactionId));
      const tempOrderSnap = await getDocs(tempOrderQuery);

      if (!tempOrderSnap.empty) {
        const tempOrderData = tempOrderSnap.docs[0].data();

        // Merge temporder data with payment details and add orderStatus
        const mergedOrder = {
          ...tempOrderData,
          paymentDetails: details,
          paymentStatus: status,
          paidAmount: parseInt(amount) / 100,
          orderStatus: "Processing", // Default order status
        };

        // Save merged data to orders collection
        await setDoc(orderDocRef, mergedOrder);
        console.log("Order saved successfully with orderStatus.");
      } else {
        console.error(`No matching document in temporder for transactionId: ${clientTransactionId}`);
      }
    } catch (error) {
      console.error("Error while saving order data:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.push("/"); // Redirect to home page after 5 seconds
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Thank you for your payment. Your order is being processed and will be updated shortly.
      </p>
      <p className="mt-2 text-sm text-gray-600">
        You will be redirected to the home page in 5 seconds.
      </p>
    </div>
  );
}

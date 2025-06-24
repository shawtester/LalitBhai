import { db } from "@/lib/firebase"; // Import your Firestore instance from your Firebase configuration
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions

// Function to store data in 'permanentOrder' collection
export async function storePermanentOrder(data) {
  try {
    // Validate and set default values for critical fields
    const totalAmount = data.totalAmount ?? "0"; // Ensure totalAmount is defined (defaulting to "0" if undefined)
    const userId = data.userId ?? "unknown"; // Handle potential undefined userId
    const transactionId = data.transactionId ?? "unknown"; // Handle potential undefined transactionId

    // Map and validate cart items
    const cartItems = (data.carts || []).map(item => ({
      id: item.id || "unknown",
      flavor: item.flavor || "unknown",
      price: item.price || "0",
      salePrice: item.salePrice || "0",
      quantity: item.quantity || 0,
      weight: item.weight || "unknown"
    }));

    // Map and validate order details
    const orderDetails = (data.orderDetails || []).map(detail => ({
      MUID: detail.MUID || "unknown",
      fullName: detail.fullName || "unknown",
      addressLine1: detail.addressLine1 || "",
      addressLine2: detail.addressLine2 || "",
      addressLine3: detail.addressLine3 || "",
      amount: detail.amount || "0",
      mobile: detail.mobile || "unknown",
      pincode: detail.pincode || "unknown",
      state: detail.state || "unknown",
      transactionId: detail.transactionId || "unknown"
    }));

    // Construct the order data object
    const orderData = {
      cartItems,       // Validated array of cart items
      orderDetails,    // Validated array of order details
      totalAmount,     // Ensured to be defined
      userId,          // Ensured to be defined
      createdAt: new Date(), // Store the creation timestamp
      status: "completed", // Default status
      transactionId    // Ensured to be defined
    };

    // Log data before storing to ensure it is correct
    console.log("Order data being added:", orderData);

    // Store the order data in Firestore
    const docRef = await addDoc(collection(db, "permanentOrder"), orderData);
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw new Error("Failed to store permanent order");
  }
}

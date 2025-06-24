import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp, addDoc, collection } from "firebase/firestore";


export const writeToFirestore = async (data) => {
  try {
    
    const docRef = await addDoc(collection(db, 'orders'), data);

    
    console.log("Order document written with ID: ", docRef.id);

    
    const orderDataWithId = {
      ...data,
      orderId: docRef.id, 
    };

    
    await setDoc(docRef, orderDataWithId);

    console.log("Order data with ID updated:", docRef.id);

    
    return docRef.id;
  } catch (error) {
    console.error("Error adding order document: ", error);
    throw error;
  }
};


export const createUser = async ({ uid, displayName, photoURL, email }) => {
  try {
    await setDoc(
      doc(db, `users/${uid}`),
      {
        displayName: displayName ?? "",
        photoURL: photoURL ?? "",
        email: email ?? "", // Add email field here
        timestampCreate: Timestamp.now(),
      },
      { merge: true } // Merge ensures existing fields aren't overwritten unless specified
    );
    console.log("User document created/updated with email:", email);
  } catch (error) {
    console.error("Error creating/updating user: ", error);
    throw error;
  }
};



export const updateFavorites = async ({ uid, list }) => {
  try {
    
    const favoritesList = list ?? []; 

    await setDoc(
      doc(db, `users/${uid}`),
      {
        favorites: favoritesList,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating favorites: ", error);
    throw error;
  }
};

export const updateCarts = async ({ uid, list }) => {
  try {
    await setDoc(
      doc(db, `users/${uid}`),
      {
        carts: list,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating carts: ", error);
    throw error;
  }
};


export const writeOrderWithUser = async (orderData, userId) => {
  try {
    
    const orderWithUser = {
      ...orderData,
      userId: userId, // Link order with the user ID
      timestamp: Timestamp.now(), // Add timestamp for the order
    };

    // Call the writeToFirestore function to save the order data
    const orderId = await writeToFirestore(orderWithUser);
    console.log("Order written with userId: ", orderId);
    return orderId; // Return the order ID for further processing
  } catch (error) {
    console.error("Error writing order with user ID: ", error);
    throw error;
  }
};


export const addOrderDetails = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'OrderDetails'), orderData);
    console.log('Order Details added with ID:', docRef.id);
    return docRef.id; // Return the document ID if needed
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e; // You can handle the error appropriately
  }
};

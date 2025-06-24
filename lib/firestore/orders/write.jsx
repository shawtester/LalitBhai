
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../../firebase"; 


const db = getFirestore(app)

export async function writeOrderToFirestore(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: Timestamp.now(),
    });

    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return document ID if you need it
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error adding document to Firestore");
  }
}

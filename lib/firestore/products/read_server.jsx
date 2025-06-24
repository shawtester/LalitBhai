import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

// Function to handle Firestore data conversion
const convertFirestoreTimestamps = (data) => {
  // Safely handle conversion of timestampCreate
  if (data.timestampCreate && data.timestampCreate.toDate) {
    // Check if it's a Firestore Timestamp and convert to ISO string
    data.timestampCreate = data.timestampCreate.toDate().toISOString();
  }

  // Safely handle conversion of timestampUpdate
  if (data.timestampUpdate && data.timestampUpdate.toDate) {
    data.timestampUpdate = data.timestampUpdate.toDate().toISOString();
  }

  return data;
};

// Function to fetch a product by ID
export const getProduct = async ({ id }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return convertFirestoreTimestamps(data.data()); // Ensure proper conversion
  } else {
    return null;
  }
};

// Fetch featured products
export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => convertFirestoreTimestamps(snap.data())); // Convert timestamps
};

// Fetch all products
export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map((snap) => convertFirestoreTimestamps(snap.data())); // Convert timestamps
};

// Fetch products by category
export const getProductsByCategory = async ({ categoryId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  return list.docs.map((snap) => convertFirestoreTimestamps(snap.data())); // Convert timestamps
};

export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

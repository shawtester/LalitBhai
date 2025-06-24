import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const searchProducts = async (searchTerm) => {
  if (!searchTerm) return []; // Return empty if no search term is provided.

  const productsRef = collection(db, "products");
  const q = query(productsRef); // Fetch all products initially.
  const snapshot = await getDocs(q);

  // Filter results for case-insensitive, partial match.
  const results = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const title = data.title.toLowerCase();
    const search = searchTerm.toLowerCase();

    if (title.includes(search)) {
      results.push({ id: doc.id, ...data });
    }
  });

  return results;
};

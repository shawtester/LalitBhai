import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// Helper function to convert Firestore timestamp to Date or string
const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000); // Convert to JavaScript Date object
  }
  return null; // Return null if no timestamp is provided
};

export const getBrand = async ({ id }) => {
  const data = await getDoc(doc(db, `brands/${id}`));
  if (data.exists()) {
    const brand = data.data();
    // Convert timestamp to Date before returning
    if (brand?.timestampCreate) {
      brand.timestampCreate = convertTimestamp(brand.timestampCreate);
    }
    return brand;
  } else {
    return null;
  }
};

export const getBrands = async () => {
  const list = await getDocs(collection(db, "brands"));
  return list.docs.map((snap) => {
    const brand = snap.data();
    // Convert timestamp to Date before returning
    if (brand?.timestampCreate) {
      brand.timestampCreate = convertTimestamp(brand.timestampCreate);
    }
    return brand;
  });
};

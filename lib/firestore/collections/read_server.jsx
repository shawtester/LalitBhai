import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";


const convertTimestampToISO = (timestamp) => {
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return timestamp; 
};

export const getCollection = async ({ id }) => {
  const data = await getDoc(doc(db, `collections/${id}`));
  if (data.exists()) {
    const collectionData = data.data();

  
    if (collectionData.timestampCreate) {
      collectionData.timestampCreate = convertTimestampToISO(collectionData.timestampCreate);
    }

    // Add additional conversions if necessary for other complex fields

    return collectionData;
  } else {
    return null;
  }
};

export const getCollections = async () => {
  const list = await getDocs(collection(db, "collections"));
  return list.docs.map((snap) => {
    const collectionData = snap.data();

    // Convert any complex fields to simpler values
    if (collectionData.timestampCreate) {
      collectionData.timestampCreate = convertTimestampToISO(collectionData.timestampCreate);
    }

  

    return collectionData;
  });
};

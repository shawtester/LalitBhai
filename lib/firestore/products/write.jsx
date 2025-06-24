import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";

export const createNewProduct = async ({ data, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }

  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    id: newId,
    imageList: imageList, // Save the image list with the product data
    timestampCreate: Timestamp.now(),
  });
};

export const updateProduct = async ({ data, imageList }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  await setDoc(doc(db, `products/${data?.id}`), {
    ...data,
    imageList: imageList, // Update the image list
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteProduct = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `products/${id}`));
};
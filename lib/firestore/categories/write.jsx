import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const createNewCategory = async ({ data }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }

  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `categories/${newId}`), {
    ...data,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateCategory = async ({ data }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.slug) {
    throw new Error("Slug is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  const id = data?.id;

  await updateDoc(doc(db, `categories/${id}`), {
    ...data,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteCategory = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `categories/${id}`));
};

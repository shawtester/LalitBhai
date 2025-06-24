import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const createNewAdmin = async ({ data }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const newId = data?.email;

  await setDoc(doc(db, `admins/${newId}`), {
    ...data,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateAdmin = async ({ data }) => {
  if (!data?.name) {
    throw new Error("Name is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  if (!data?.email) {
    throw new Error("Email is required");
  }

  const id = data?.id;

  if (id === data?.email) {
    await updateDoc(doc(db, `admins/${id}`), {
      ...data,
      timestampUpdate: Timestamp.now(),
    });
  } else {
    const newId = data?.email;

    await deleteDoc(doc(db, `admins/${id}`));

    await setDoc(doc(db, `admins/${newId}`), {
      ...data,
      id: newId,
      timestampUpdate: Timestamp.now(),
    });
  }
};

export const deleteAdmin = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `admins/${id}`));
};

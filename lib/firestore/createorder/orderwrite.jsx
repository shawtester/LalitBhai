import { db } from '@/lib/firebase'; // Adjust import path to your Firebase config
import { collection, addDoc } from 'firebase/firestore';

export async function createOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id; // Return the order ID
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

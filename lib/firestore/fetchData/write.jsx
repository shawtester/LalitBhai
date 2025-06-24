import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Fetch Final Order Data
export const fetchFinalOrderData = async () => {
  try {
    const finalOrderSnapshot = await getDocs(collection(db, 'finalorder'));
    const finalOrderData = finalOrderSnapshot.docs.map((doc) => ({
      id: doc.id,
      status: doc.data().status || 'Processed',  // Ensure the status is returned
      ...doc.data(),
    }));
    return finalOrderData;
  } catch (error) {
    console.error('Error fetching final order data:', error);
    return null;
  }
};



export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(db, "finalorder", orderId);
  try {
    await updateDoc(orderRef, {
      OrderStatus: newStatus, // Update the OrderStatus
    });
    console.log("Order status updated successfully");
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

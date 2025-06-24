import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Fetch all data from Firestore (orders, orderDetails, users)
export const fetchAllData = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const orderDetailsSnapshot = await getDocs(collection(db, 'OrderDetails'));
    const usersSnapshot = await getDocs(collection(db, 'users'));

    const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const orderDetailsData = orderDetailsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { ordersData, orderDetailsData, usersData };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};





// Save order to finalorder collection
export const saveOrder = async (entry) => {
  try {
    const orderRef = doc(db, 'finalorder', entry.transactionId);

    // Fetch existing final order
    const existingOrder = await getDoc(orderRef);

    if (existingOrder.exists()) {
      console.log('Order already exists. Skipping saving this order.');
      return; // Skip if the order already exists
    }

    // If no existing order, create a new one
    await setDoc(orderRef, {
      userId: entry.userId,
      transactionId: entry.transactionId,
      amount: entry.amount,
      fullName: entry.fullName,
      mobile: entry.mobile,
      addressLine1: entry.addressLine1,
      addressLine2: entry.addressLine2,
      addressLine3: entry.addressLine3,
      pincode: entry.pincode,
      state: entry.state,
      status: entry.status,
      createdAt: entry.createdAt,
      providerReferenceId: entry.providerReferenceId,
      carts: entry.user.carts, // Write carts only once
      OrderStatus: "Proceed", // Add the initial "Proceed" status
    });

    console.log('Final order data successfully saved with initial OrderStatus: Proceed.');
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

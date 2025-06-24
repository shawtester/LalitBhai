"use client";

import { useState, useEffect } from "react";
import { use } from "react"; // Import the `use` function for unwrapping promises
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function OrderDetailsPage({ params }) {
  const { id } = use(params); // Unwrap the params object
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState(""); // Manage new status

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "finalorder", id); // Adjust collection name if necessary
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  // Handle updating OrderStatus
  const handleUpdateOrderStatus = async () => {
    try {
      const docRef = doc(db, "finalorder", id);
      await updateDoc(docRef, { OrderStatus: newOrderStatus });
      setOrder((prev) => ({ ...prev, OrderStatus: newOrderStatus })); // Update state
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Failed to update OrderStatus:", err);
      alert("Error updating order status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Customer Details:</h2>
        <p><strong>Name:</strong> {order.fullName}</p>
        <p><strong>Mobile:</strong> {order.mobile}</p>
        <p><strong>Address:</strong> {order.addressLine1}, {order.addressLine2}, {order.addressLine3}</p>
        <p><strong>Pincode:</strong> {order.pincode}</p>
        <p><strong>State:</strong> {order.state}</p>

        <h2 className="font-semibold mt-4">Order Summary:</h2>
        <p><strong>Status:</strong> {order.OrderStatus}</p>
        <p><strong>Transaction ID:</strong> {order.transactionId}</p>
        <p><strong>Amount:</strong> {order.amount}</p>

        <h2 className="font-semibold mt-4">Cart Items:</h2>
        {order.carts.map((item, idx) => (
          <div key={idx} className="mb-2">
            <p><strong>Flavor:</strong> {item.flavor}</p>
            <p><strong>Weight:</strong> {item.weight}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Sale Price:</strong> {item.salePrice}</p>
          </div>
        ))}
      </div>

      {/* Update OrderStatus */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Update Order Status</h2>
        <input
          type="text"
          value={newOrderStatus}
          onChange={(e) => setNewOrderStatus(e.target.value)}
          placeholder="Enter new order status"
          className="border border-gray-300 rounded p-2 w-full mb-4"
        />
        <button
          onClick={handleUpdateOrderStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@/lib/firestore/orders/read"; // Ensure this function is updated
import { useAuth } from "@/context/AuthContext";
import { FaShippingFast, FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdPayment, MdLocationOn } from "react-icons/md";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OrdersPage = () => {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for the logged-in user
  useEffect(() => {
    const getOrders = async () => {
      if (user) {
        const fetchedOrders = await fetchOrders(user.uid); // Ensure this fetches updated fields
        setOrders(fetchedOrders);
        setLoading(false);
      }
    };
    getOrders();
  }, [user]);

  if (isLoading || loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center py-10">You need to log in to view your orders.</p>;
  }

  return (
    <>
    <Header/>
  
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Your Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.transactionId}
              className="border rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  <FaBoxOpen className="inline-block text-indigo-600 mr-2" />
                  Order ID:{" "}
                  <span className="text-indigo-600">{order.transactionId}</span>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <MdLocationOn className="mr-2 text-indigo-600" />
                Ordered by: {order.name}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <MdLocationOn className="mr-2 text-indigo-600" /> Shipping
                    Address:
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.addressLine1}, {order.addressLine2}, {order.addressLine3},{" "}
                    {order.landmark} - {order.pincode}, {order.state}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Mobile:</span> {order.mobile}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <MdPayment className="inline-block mr-2 text-indigo-600" />
                    <span className="font-medium">Amount Paid:</span> ₹{order.amount}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Card Type:</span>{" "}
                    {order.paymentDetails?.paymentInstrument?.cardType || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <FaShippingFast className="mr-2 text-indigo-600" />
                    Cart Items:
                  </h3>
                  <ul className="space-y-2">
                    {order.cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 rounded-md p-3"
                      >
                        <span className="font-medium text-gray-800">
                          {item.flavor} - {item.weight}
                        </span>
                        <span className="text-indigo-600 font-semibold">
                          ₹{item.salePrice} (Qty: {item.quantity})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Status */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">
                  <FaCheckCircle className="inline-block mr-2 text-indigo-600" />
                  Order Status
                </h3>
                <div className="flex items-center space-x-4">
                  <StepIndicator
                    step="Processing"
                    isActive={order.orderStatus === "Processing"}
                  />
                  <StepIndicator
                    step="Shipped"
                    isActive={order.orderStatus === "Shipped"}
                  />
                  <StepIndicator
                    step="Delivered"
                    isActive={order.orderStatus === "Delivered"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

// Step Indicator Component
const StepIndicator = ({ step, isActive }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`h-4 w-4 rounded-full ${
          isActive ? "bg-indigo-600" : "bg-gray-300"
        }`}
      ></div>
      <span
        className={`text-sm ${
          isActive ? "font-bold text-gray-800" : "text-gray-500"
        }`}
      >
        {step}
      </span>
    </div>
  );
};

export default OrdersPage;

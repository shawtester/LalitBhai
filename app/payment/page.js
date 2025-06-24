"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/lib/firestore/user/read";
import { writeTempOrder } from "@/lib/firestore/temp/write";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState(null);

  // Address form fields
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
    landmark: "",
    state: "",
  });

  // Extract UID and totalAmount from the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const uid = urlParams.get("uid");
      const totalAmount = urlParams.get("totalAmount");

      setUserId(uid);
      setAmount(totalAmount || ""); // Set amount from URL if available
    }
  }, []);

  // Fetch user and cart data
  const { data: user, isLoading: userLoading, error: userError } = useUser({ uid: userId });

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Payment and Firestore Save Handler
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.carts || user.carts.length === 0) {
      console.error("No cart data available");
      setLoading(false);
      return;
    }

    // Prepare cart data
    const cartItems = user.carts.map((item) => ({
      id: item.id,
      flavor: item.flavor,
      price: item.price,
      quantity: item.quantity,
      salePrice: item.salePrice,
      weight: item.weight,
    }));

    // Data to be sent to the backend and Firestore
    const data = {
      name,
      mobile,
      amount,
      userId,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      addressLine3: address.addressLine3,
      pincode: address.pincode,
      landmark: address.landmark,
      state: address.state,
      MUID: "MUID" + Date.now(),
      transactionId: "T" + Date.now(),
      cartItems,
    };

    try {
      // Save data to Firestore temporder collection
      await writeTempOrder(data);

      // Send data to backend for payment initiation
      const response = await axios.post("http://localhost:3000/api/order", data);

      if (response.data && response.data.data.instrumentResponse.redirectInfo.url) {
        window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-green-500">
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-lg lg:flex lg:flex-row">
        {/* Left Section: Video */}
        <div className="w-full lg:w-1/2 lg:px-8">
          <div className="p-6">
            <video
              src="https://www.phonepe.com/webstatic/8020/videos/page/home-fast-secure-v3.mp4"
              autoPlay
              loop
              muted
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Right Section: Payment Form */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:px-8">
          <div className="p-8 bg-green-500 rounded-lg shadow-md">
            <h2 className="mb-6 text-3xl font-bold text-center text-white">Make a Payment</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <InputField label="Name" id="name" value={name} setValue={setName} required />
              <InputField label="Mobile" id="mobile" value={mobile} setValue={setMobile} required />
              <InputField
                label="Amount"
                id="amount"
                value={amount}
                setValue={setAmount}
                required
                placeholder="Enter amount"
              />
              <AddressFields address={address} handleAddressChange={handleAddressChange} />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, id, value, setValue, required, placeholder = "" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="block w-full py-2 pl-4 pr-4 text-gray-900 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
  );
}

function AddressFields({ address, handleAddressChange }) {
  return (
    <>
      {["addressLine1", "addressLine2", "addressLine3", "pincode", "landmark", "state"].map(
        (field) => (
          <InputField
            key={field}
            label={field.replace(/([A-Z])/g, " $1")}
            id={field}
            value={address[field]}
            setValue={(value) => handleAddressChange({ target: { name: field, value } })}
          />
        )
      )}
    </>
  );
}

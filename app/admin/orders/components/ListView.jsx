"use client";

import { useState } from "react";
import { useAllOrders } from "@/lib/firestore/orders/read"; // Import the useAllOrders hook
import { Button, CircularProgress } from "@nextui-org/react"; // Import necessary UI components
import { Avatar } from "@nextui-org/react"; // Avatar to display user photo
import { useUser } from "@/lib/firestore/user/read"; // To get user data
import Link from "next/link"; // To link to order details

export default function ListView() {
  const [showLimit, setShowLimit] = useState(5); // Initially show 5 orders
  const { data: orders, error, isLoading } = useAllOrders({
    pageLimit: showLimit, // Fetch orders based on the showLimit
  });

  // Loading state
  if (isLoading) {
    return <CircularProgress />;
  }

  // Error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // No orders state
  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }

  // Function to handle show more orders
  const handleShowMore = () => {
    setShowLimit((prevLimit) => prevLimit + 5); // Show 5 more orders on each click
  };

  // Render component
  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">SN</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Customer</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Order Status</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Amount</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Address</th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) =>
            item ? (
              <Row
                key={`${item.id}-${index}`} // Ensure unique key for each row
                item={item}
                index={index + 1} // Indexing starts from 1
              />
            ) : null
          )}
        </tbody>
      </table>

      {/* Show More Button */}
      {orders.length >= showLimit && (
        <div className="text-center mt-4">
          <Button onClick={handleShowMore} color="primary">
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ item, index }) {
  const { data: user } = useUser({ uid: item?.userId }); // Fetch user data

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index}</td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex gap-2 items-center">
          <Avatar size="sm" src={user?.photoURL || "/default-avatar.png"} />
          <div className="flex flex-col">
            <h1>{user?.displayName || "Anonymous User"}</h1>
            <h1 className="text-xs text-gray-600">{user?.email || "No Email"}</h1>
          </div>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex">
          <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
            {item?.OrderStatus || "Pending"}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.amount}</td>
      <td className="border-y bg-white px-3 py-2">
        <div>
          <p>{item?.addressLine1}</p>
          <p>{item?.addressLine2}</p>
          <p>{item?.addressLine3}</p>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <Link href={`/admin/orders/${item?.id}`}>
          <Button size="sm" color="primary">
            View
          </Button>
        </Link>
      </td>
    </tr>
  );
}

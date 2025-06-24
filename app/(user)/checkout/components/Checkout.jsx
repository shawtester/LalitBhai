"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { getProduct } from "@/lib/firestore/products/read_server";

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // Get user data from context

  // State to hold product data fetched from Firestore
  const [productsData, setProductsData] = useState({});

  // Fetch product data for each productId in productList
  useEffect(() => {
    if (productList?.length > 0) {
      productList.forEach(async (item) => {
        const productId = item?.id;
        if (productId) {
          const productData = await getProduct({ id: productId });
          if (productData) {
            setProductsData((prevData) => ({
              ...prevData,
              [productId]: productData, // Store product data by productId
            }));
          } else {
            console.error("No product found for productId:", productId);
          }
        }
      });
    }
  }, [productList]);

  // Calculate total amount
  const calculateTotalAmount = () => {
    return productList?.reduce((total, item) => {
      const salePrice = parseFloat(item?.salePrice || 0);
      const totalItemPrice = salePrice * (item?.quantity || 0);
      return total + totalItemPrice;
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!user?.uid) {
      toast.error("User is not logged in.");
      return;
    }

    setIsLoading(true);
    try {
      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      // Store product data in sessionStorage
      sessionStorage.setItem("orderData", JSON.stringify({
        userId: user?.uid,
        products: productList.map(item => ({
          productId: item?.id,
          quantity: item?.quantity,
          flavor: item?.flavor,
          price: item?.salePrice,
          totalPrice: item?.salePrice * item?.quantity
        })),
        totalAmount: totalAmount
      }));

      // Generate a URL for the payment page, include the user ID and totalAmount as query parameters
      const paymentPageURL = `/payment?uid=${user?.uid}&totalAmount=${totalAmount}`;

      router.push(paymentPageURL); // Navigate to the payment page
      toast.success("Redirecting to payment...");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row p-6 gap-6">
      {/* Left side: Products List */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>
        <div className="flex flex-col gap-4">
          {productList?.map((item, index) => {
            const salePrice = parseFloat(item?.salePrice || 0);
            const totalItemPrice = salePrice * (item?.quantity || 0);
            const productData = productsData[item?.id] || {}; // Retrieve product data using productId
            const imageUrl = productData?.imageList?.[0] || "/default-image.jpg"; // Fallback to a default image if no image is available

            return (
              <div
                key={index}
                className="flex flex-col lg:flex-row gap-4 items-center lg:items-start border p-4 rounded-lg shadow-md bg-gray-50"
              >
                {/* Image */}
                <img
                  className="w-48 h-48 object-cover rounded-lg" // Increased size
                  src={imageUrl}
                  alt={productData?.title || "Product image"}
                />

                {/* Product Details */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4 justify-between lg:ml-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                      {productData?.title || "Unknown Product"}
                    </h2>
                    <div className="text-sm text-gray-700 bg-white rounded-lg p-3 shadow-inner">
                      <p><strong>Quantity:</strong> {item?.quantity || 0}</p>
                      <p><strong>Sale Price:</strong> ₹ {salePrice}</p>
                      <p><strong>Flavour:</strong> {item?.flavor || "N/A"}</p>
                      <p><strong>Weight:</strong> {item?.weight || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-start">
                    <p className="text-lg font-semibold">₹ {totalItemPrice}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Total Price and Place Order */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg p-6 mt-6 lg:mt-0">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold">Grand Total: ₹ {totalAmount}</h3>
        </div>
        <section className="mt-4">
          {user && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Logged in as:</h3>
              <p className="text-gray-700">User ID: {user.uid}</p>
            </div>
          )}

<Button
  isLoading={isLoading} // Show loading state
  loadingText="Processing..."
  onClick={!isLoading ? handlePlaceOrder : null} // Prevent additional clicks
  disabled={isLoading} // Disable the button during the process
  color="primary"
  className={`w-full py-3 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`} // Add visual feedback
>
  {isLoading ? "Processing..." : "Place Order"}
</Button>

        </section>
      </div>
    </section>
  );
}

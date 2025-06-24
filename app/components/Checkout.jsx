"use client";
import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"; // Assuming you are using react-hot-toast for notifications

export default function CheckoutPage() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 justify-center items-center p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Checkout</h1>
      
      {/* Display Cart Items */}
      <CartItems data={data} />

      {/* Payment Section */}
      <PaymentSection />
    </main>
  );
}

function CartItems({ data }) {
  if (!data?.carts || data?.carts?.length === 0) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center h-full w-full py-20">
        <div className="flex justify-center">
          <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
        </div>
        <h1 className="text-gray-600 font-semibold text-lg">
          Please Add Products To Cart
        </h1>
      </div>
    );
  }

  return (
    <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
      {data?.carts?.map((item, index) => (
        <ProductItem item={item} key={`${item?.id}-${index}`} />
      ))}
    </div>
  );
}

function ProductItem({ item }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: product } = useProduct({ productId: item?.id });

  const [selectedWeight, setSelectedWeight] = useState(item?.weight || product?.weights?.[0]?.weight);
  const [selectedFlavor, setSelectedFlavor] = useState(item?.flavor || product?.flavors?.[0]?.name);
  const [price, setPrice] = useState(product?.weights?.find(w => w?.weight === selectedWeight)?.price || 0);
  const [salePrice, setSalePrice] = useState(product?.weights?.find(w => w?.weight === selectedWeight)?.salePrice || 0);

  useEffect(() => {
    if (selectedWeight) {
      const selected = product?.weights?.find(w => w?.weight === selectedWeight);
      setPrice(selected?.price || 0);
      setSalePrice(selected?.salePrice || 0);
    }
  }, [selectedWeight]);

  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d) => d?.id !== item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (newWeight, newFlavor, quantity) => {
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d) => {
        if (d?.id === item?.id) {
          return {
            ...d,
            weight: newWeight,
            flavor: newFlavor,
            quantity: parseInt(quantity),
          };
        }
        return d;
      });
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-5 items-start border px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out">
      <div className="flex gap-4 items-center">
        <div className="h-20 w-20 p-2">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={product?.imageList[0]}
            alt={product?.title}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl font-semibold text-gray-800">{product?.title}</h1>
          <div className="text-lg text-green-600">
            ₹ {salePrice}{" "}
            <span className="line-through text-sm text-gray-500">
              ₹ {price}
            </span>
          </div>
          <div className="flex flex-col text-sm gap-2">
            <label htmlFor="weight-select" className="text-gray-700 font-medium">Select Weight:</label>
            <select
              id="weight-select"
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="p-2 border rounded-md shadow-sm"
            >
              {product?.weights?.map((weight, index) => (
                <option key={index} value={weight?.weight}>
                  {weight?.weight}g - ₹{weight?.salePrice}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col text-sm gap-2">
            <label htmlFor="flavor-select" className="text-gray-700 font-medium">Select Flavor:</label>
            <select
              id="flavor-select"
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              className="p-2 border rounded-md shadow-sm"
            >
              {product?.flavors?.map((flavor, index) => (
                <option key={index} value={flavor?.name}>
                  {flavor?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <Button
          onClick={() => handleUpdate(selectedWeight, selectedFlavor, item?.quantity - 1)}
          isDisabled={isUpdating || item?.quantity <= 1}
          isIconOnly
          size="sm"
          className="h-6 w-6 bg-gray-300 text-gray-700 hover:bg-gray-400"
        >
          <Minus size={14} />
        </Button>
        <span className="text-lg font-medium">{item?.quantity}</span>
        <Button
          onClick={() => handleUpdate(selectedWeight, selectedFlavor, item?.quantity + 1)}
          isDisabled={isUpdating}
          isIconOnly
          size="sm"
          className="h-6 w-6 bg-gray-300 text-gray-700 hover:bg-gray-400"
        >
          <Plus size={14} />
        </Button>
      </div>

      <Button
        onClick={handleRemove}
        isLoading={isRemoving}
        isDisabled={isRemoving}
        isIconOnly
        color="error"
        size="sm"
        className="mt-4"
      >
        <X size={16} />
      </Button>
    </div>
  );
}

function PaymentSection() {
  return (
    <div className="p-5 w-full md:max-w-[900px]">
      <h2 className="text-2xl font-semibold text-gray-800">Payment Options</h2>
      <p className="text-gray-600 mt-2">Please select your preferred payment method to proceed.</p>
      <div className="flex gap-4 mt-4">
        <Button className="bg-green-500 px-6 py-3 text-lg rounded-lg text-white hover:bg-green-600 transition-all">
          Pay with Razorpay
        </Button>
        {/* Add more payment options as needed */}
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  productId,
  selectedWeight,
  selectedFlavor,
  price,
  salePrice,
  
}) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item) => item?.id === productId && item?.weight === selectedWeight?.weight && item?.flavor === selectedFlavor?.name);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please Log In First!");
      }

      // Create cart item with selected weight, flavor, price, and quantity
      const cartItem = {
        id: productId,
        quantity: 1, // You can adjust the quantity logic as needed
        weight: selectedWeight?.weight,
        flavor: selectedFlavor?.name,
        price: price,
        salePrice: salePrice,
      };

      if (isAdded) {
        // Remove item from cart
        const newList = data?.carts?.filter(
          (item) => !(item?.id === productId && item?.weight === selectedWeight?.weight && item?.flavor === selectedFlavor?.name)
        );
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        // Add item to cart
        const newList = [...(data?.carts ?? []), cartItem];
        await updateCarts({ list: newList, uid: user?.uid });
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };




  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleClick}
      variant="flat"
      isIconOnly
      size="sm"
    >
      {!isAdded && <AddShoppingCartIcon className="text-xs" />}
      {isAdded && <ShoppingCartIcon className="text-xs" />}
    </Button>
  );
}

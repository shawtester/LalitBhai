"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle favorite button click
  const handleClick = async () => {
    if (!user?.uid) {
      router.push("/login");
      return toast.error("Please Log In First!");
    }

    setIsLoading(true);
    try {
      // Safeguard: Ensure favorites is always an array, default to empty array if undefined
      const currentFavorites = Array.isArray(data?.favorites) ? data.favorites : [];

      // Add or remove product from the favorites list
      let updatedFavorites;
      if (currentFavorites.includes(productId)) {
        updatedFavorites = currentFavorites.filter(item => item !== productId);
      } else {
        updatedFavorites = [...currentFavorites, productId];
      }

      // Ensure that updatedFavorites is not undefined or null before updating Firestore
      if (updatedFavorites === undefined || updatedFavorites === null) {
        throw new Error("Invalid favorites list.");
      }

      // Update the favorites in the database
      await updateFavorites({ uid: user.uid, list: updatedFavorites });

      toast.success(isLiked ? "Removed from favorites!" : "Added to favorites!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the product is already in favorites
  const isLiked = Array.isArray(data?.favorites) && data?.favorites.includes(productId);

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handleClick}
      variant="light"
      color="danger"
      className="rounded-full"
      isIconOnly
      size="sm"
    >
      {isLiked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <FavoriteBorderOutlinedIcon fontSize="small" />
      )}
    </Button>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";

export default function Layout({ children }) {
  const { user } = useAuth();
  const { data, error, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data?.carts || data?.carts?.length === 0) {
    return (
      <div>
        <h2>Your Cart Is Empty</h2>
      </div>
    );
  }

  return <>{children}</>;
}

import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SuccessLayout({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

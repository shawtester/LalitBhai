import { getProduct } from "@/lib/firestore/products/read_server";
import Photos from "./components/Photos";
import Details from "./components/Details";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReview from "./components/AddReview";
import AuthContextProvider from "@/context/AuthContext";

export async function generateMetadata({ params }) {
  // Await params to avoid the error
  const { productId } = await params;
  const product = await getProduct({ id: productId });

  return {
    title: `${product?.title} | Product`,
    description: product?.shortDescription ?? "",
    openGraph: {
      images: [product?.imageList[0]],
    },
  };
}

export default async function Page({ params }) {
  // Await params to avoid the error
  const { productId } = await params;
  const product = await getProduct({ id: productId });

  return (
    <main className="p-5 md:p-10">
      {/* Section for Photos and Details */}
      <section className="flex flex-col md:flex-row gap-3">
        {/* Photos component displayed first on small screens */}
        <Photos
          imageList={[product?.featureImageURL, ...(product?.imageList ?? [])]}
          className="order-1 md:order-none"
        />
        {/* Details component displayed second on small screens */}
        <Details product={product} className="order-2 md:order-none" />
      </section>

      {/* Section for AddReview and Reviews */}
      <div className="flex justify-center py-10">
        <AuthContextProvider>
          <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
            <AddReview productId={productId} />
            <Reviews productId={productId} />
          </div>
        </AuthContextProvider>
      </div>

      {/* Related Products Section */}
      <RelatedProducts categoryId={product?.categoryId} />
    </main>
  );
}

import { use } from "react";
import { ProductCard } from "@/app/components/Products";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const category = await getCategory({ id: categoryId });

  return {
    title: `${category?.name} | Category`,
    openGraph: {
      images: [category?.imageURL],
    },
  };
}

export default async function Page({ params }) {
  const { categoryId } = params;
  const categoryPromise = getCategory({ id: categoryId });
  const productsPromise = getProductsByCategory({ categoryId });

  const category = await categoryPromise;

  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-4xl">{category.name}</h1>
        <ProductGrid productsPromise={productsPromise} />
      </div>
    </main>
  );
}

function ProductGrid({ productsPromise }) {
  // Use React's experimental "use" function to await promises
  const products = use(productsPromise);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
      {products?.map((item) => (
        <ProductCard product={item} key={item?.id} />
      ))}
    </div>
  );
}

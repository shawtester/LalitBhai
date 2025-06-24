
import Header from "@/app/components/Header";
import Carousel from "@/app/components/Carousel";
import CustomerReviews from "./components/CustomerReviews";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Brands from "./components/Brands";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";

import ProductsGridView from "./components/Products";
import Footer from "./components/Footer";
import Display from "./components/Display";
import Video from './components/Videos'








export default async function Home() {
  const [brands,collections] =
  await Promise.all([
    
    getBrands(),
    getCollections(),

  
  
    
  ]);
  


 
  return (
    <main>
      <Header />
      <Carousel />

    
   
     
     <Categories />
     <ProductsGridView />
     <Display/>
      <Brands brands={brands} />
      
     
      <CustomerReviews/>
      <Footer/>
      
      
    </main>
  );
}

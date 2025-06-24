
"use client";
import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Description";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import {
  createNewProduct,
  updateProduct,
} from "@/lib/firestore/products/write";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";

export default function Page() {
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getProduct({ id: id });
      
      if (!res) {
        throw new Error("Product Not Found");
      } else {
        setData(res);
        setFeatureImage(res.featureImage);
        setImageList(res.imageList);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    console.log("Creating product with data:", data); // Log the data being sent
    try {
      await createNewProduct({
        data: {
          ...data,
          vegType: data?.vegType ?? "veg",  // Ensure vegType is included
          flavors: data?.flavors ?? [],
          weights: data?.weights ?? [],
        },
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product successfully created!");
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    console.log("Updating product with data:", data); // Log the data being sent
    try {
      await updateProduct({
        data: {
          ...data,
          vegType: data?.vegType ?? "veg",  // Ensure vegType is included
          flavors: data?.flavors ?? [],
          weights: data?.weights ?? [],
        },
        featureImage: featureImage,
        imageList: imageList,
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product successfully updated!");
      router.push(`/admin/products`);
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="flex flex-col gap-4 p-5 overflow-auto max-w-4xl mx-auto bg-white shadow-md rounded-lg"
      >
        <div className="flex justify-between w-full items-center">
          <h1 className="font-semibold text-lg">
            {id ? "Update Product" : "Create New Product"}
          </h1>
          <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
            {id ? "Update" : "Create"}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <BasicDetails data={data} handleData={handleData} />
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <Images
              data={data}
              featureImage={featureImage}
              setFeatureImage={setFeatureImage}
              imageList={imageList}
              setImageList={setImageList}
            />
            <Description data={data} handleData={handleData} />
          </div>
        </div>
      </form>
    </div>
  );
}

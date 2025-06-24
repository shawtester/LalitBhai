"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Brands({ brands }) {
  const settings = {
    dots: true,
    infinite: brands.length > 4, // Only enable infinite scrolling if more than 4 items
    speed: 500,
    slidesToShow: 4, // Display up to 4 items on large screens
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: brands.length > 4,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  // Only duplicate brands if there are fewer than 3 items
  const displayedBrands =
    brands.length < 3 ? [...brands, ...brands, ...brands].slice(0, 3) : brands;

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <Slider {...settings}>
        {displayedBrands.map((brand, index) => (
          <div className="px-2" key={`brand-${index}`}>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="h-20 rounded-lg md:p-5 p-2 border overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={brand?.imageURL}
                  alt={`Brand ${index + 1}`}
                />
              </div>
              {/* Display the title or category below the image */}
              {brand?.title && (
                <p className="text-center text-sm mt-2 font-medium">
                  {brand.title}
                </p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

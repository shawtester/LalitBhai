"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Collection.css';

export default function Collections({ collections }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting); // Set inView to true when section is visible
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <div ref={sectionRef} className="overflow-hidden md:p-10 p-5">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-wide">
        Discover Our Collections
      </h2>

      <Slider {...settings}>
        {collections.map((collection, index) => (
          <div className="px-4" key={`${collection?.id}-${index}`}>
            <div
              className="relative flex flex-col items-center bg-gradient-to-tr from-blue-100 via-white to-blue-50 shadow-lg p-6 rounded-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden collection-card"
              style={{
                borderRadius: "20px",
                height: "350px",
                backgroundImage: `url('/CollectionBack.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-white/10 z-0"></div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-center">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide font-serif">
                    {collection?.title}
                  </h1>
                </div>

                {/* Clickable Image with sway effect when in view */}
                <Link href={`/collections/${collection?.id}`}>
                  <img
                    className={`h-48 md:h-48 object-cover rounded-lg border-4 border-white shadow-xl transition-transform duration-300 collection-image ${
                      inView ? "animate-sway" : ""
                    }`}
                    src={collection?.imageUrl}
                    alt={collection?.title}
                  />
                </Link>

                <Link href={`/collections/${collection?.id}`}>
                  <button className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-sm md:text-lg font-bold hover:bg-purple-700 hover:scale-105 transition-transform duration-200">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

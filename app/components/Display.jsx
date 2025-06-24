'use client';

import { useEffect, useState } from 'react';

export default function AlternatingLayout() {
  // States to track visibility for each section
  const [isFirstImageVisible, setFirstImageVisible] = useState(false);
  const [isFirstTextVisible, setFirstTextVisible] = useState(false);
  const [isSecondImageVisible, setSecondImageVisible] = useState(false);
  const [isSecondTextVisible, setSecondTextVisible] = useState(false);
  const [isThirdImageVisible, setThirdImageVisible] = useState(false);
  const [isThirdTextVisible, setThirdTextVisible] = useState(false);

  // Intersection observer callback for each section
  const observeSection = (setImageVisible, setTextVisible, delay) => (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Section is in view
        setTimeout(() => setImageVisible(true), delay); // Delay image fade-in
        observer.unobserve(entry.target); // Stop observing once it's in view
        setTimeout(() => setTextVisible(true), delay + 1000); // Show text after image with a delay
      } else {
        // Section is not in view, reset opacity
        setImageVisible(false);
        setTextVisible(false);
      }
    });
  };

  useEffect(() => {
    const firstObserver = new IntersectionObserver(observeSection(setFirstImageVisible, setFirstTextVisible, 0), { threshold: 0.5 });
    const secondObserver = new IntersectionObserver(observeSection(setSecondImageVisible, setSecondTextVisible, 1000), { threshold: 0.5 });
    const thirdObserver = new IntersectionObserver(observeSection(setThirdImageVisible, setThirdTextVisible, 2000), { threshold: 0.5 });

    const firstSection = document.querySelector("#firstSection");
    const secondSection = document.querySelector("#secondSection");
    const thirdSection = document.querySelector("#thirdSection");

    if (firstSection) firstObserver.observe(firstSection);
    if (secondSection) secondObserver.observe(secondSection);
    if (thirdSection) thirdObserver.observe(thirdSection);
  }, []);

  return (
    <div className="py-10">
      {/* Why The Beauty FOC Header Section */}
      <section className="bg-red-400 text-white py-8 h-[100px] w-full mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Why Nutrition Shop</h1>
        </div>
      </section>

      {/* First Section: Image on Left, Text on Right */}
      <section id="firstSection" className="flex flex-col md:flex-row items-center md:space-x-12 space-y-8 md:space-y-0 px-6 mt-16">
        <div className="flex-1">
          {/* Lazy Load Image with Intersection Observer */}
          <img
            src="/dis01.png"
            alt="Image 1"
            width={600}
            height={400}
            className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-2000 ${isFirstImageVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <div className="flex-1 text-center md:text-left relative">
          {/* Background image behind paragraph */}
          <div
            className={`absolute inset-0 bg-cover bg-center opacity-30 rounded-lg`}
            style={{ backgroundImage: `url('/Background.jpg')` }} // Replace with the desired image URL
          ></div>
          <div className="relative z-10">
            {/* Show description after image is loaded */}
            <h2 className={`text-3xl font-semibold mb-4 transition-opacity duration-2000 ${isFirstTextVisible ? 'opacity-100' : 'opacity-0'}`}>
              Genuine & Sealed Products
            </h2>
            <p className={`text-lg text-gray-700 leading-relaxed mb-6 md:text-left text-center transition-opacity duration-2000 ${isFirstTextVisible ? 'opacity-100' : 'opacity-0'}`}>
            At The Nutrition-Bar, we are unwavering in our commitment to providing only authentic, sealed products, ensuring the highest standards of quality, safety, and trust. With a passion for excellence, we strive for nothing short of 100% satisfaction, delivering products that inspire confidence and help you look and feel your very best.
            </p>
          </div>
        </div>
      </section>

      {/* Second Section: Image on Left, Text on Right */}
      <section id="secondSection" className="flex flex-col md:flex-row-reverse items-center md:space-x-12 space-y-8 md:space-y-0 px-6 mt-16">
        <div className="flex-1">
          <img
            src="/dis02.png"
            alt="Image 2"
            width={600}
            height={400}
            className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-2000 ${isSecondImageVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <div className="flex-1 text-center md:text-left relative">
          {/* Background image behind paragraph */}
          <div
            className={`absolute inset-0 bg-cover bg-center opacity-30 rounded-lg`}
            style={{ backgroundImage: `url('/Background.jpg')` }} // Replace with the desired image URL
          ></div>
          <div className="relative z-10">
            <h2 className={`text-3xl font-semibold mb-4 transition-opacity duration-2000 ${isSecondTextVisible ? 'opacity-100' : 'opacity-0'}`}>
              AUTHRIZED DEALER
            </h2>
            <p className={`text-lg text-gray-700 leading-relaxed mb-6 md:text-left text-center transition-opacity duration-2000 ${isSecondTextVisible ? 'opacity-100' : 'opacity-0'}`}>
            At The Nutrition-Bar, we hold our clients' well-being as our top priority, which is why we never compromise on any aspect of our service. Every product we offer is meticulously sourced, rigorously tested, and certified by top-tier dealers, ensuring unmatched safety, quality. helping you achieve your health and wellness goals with confidence and peace of mind. 😊
            </p>
          </div>
        </div>
      </section>

      {/* Third Section: Image on Left, Text on Right */}
      <section id="thirdSection" className="flex flex-col md:flex-row items-center md:space-x-12 space-y-8 md:space-y-0 px-6 mt-16">
        <div className="flex-1">
          <img
            src="/dis03.png"
            alt="Image 3"
            width={600}
            height={400}
            className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-2000 ${isThirdImageVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <div className="flex-1 text-center md:text-left relative">
          {/* Background image behind paragraph */}
          <div
            className={`absolute inset-0 bg-cover bg-center opacity-30 rounded-lg`}
            style={{ backgroundImage: `url('/Background.jpg')` }} // Replace with the desired image URL
          ></div>
          <div className="relative z-10">
            <h2 className={`text-3xl font-semibold mb-4 transition-opacity duration-2000 ${isThirdTextVisible ? 'opacity-100' : 'opacity-0'}`}>
              100% SAFE AND SECURE DELIVERY
            </h2>
            <p className={`text-lg text-gray-700 leading-relaxed mb-6 md:text-left text-center transition-opacity duration-2000 ${isThirdTextVisible ? 'opacity-100' : 'opacity-0'}`}>
            At The Nutrition-Bar, we are deeply committed to providing only authentic, sealed products, ensuring the highest standards of quality, safety, and reliability. Our goal is to deliver not just products but a promise of excellence and trust. With a focus on 100% satisfaction, we strive to exceed your expectations, offering you the finest in nutrition and wellness with every purchase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

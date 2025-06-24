'use client';
import { useState, useEffect } from 'react';

const Carousel = () => {
  const carouselItems = [
    { image: '/slide1.png', alt: 'Slide 1' },
    { image: '/slide2.png', alt: 'Slide 2' },
    { image: '/slide3.png', alt: 'Slide 3' },
    { image: '/slide4.png', alt: 'Slide 4' },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Function to move to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length
    );
  };

  // Set up autoplay functionality with useEffect
  useEffect(() => {
    const autoplay = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    return () => clearInterval(autoplay); // Cleanup on unmount
  }, []);

  // Touch start event handler
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  // Touch end event handler
  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 150) {
      nextSlide(); // Swipe left, next slide
    }
    if (touchStart - touchEnd < -150) {
      prevSlide(); // Swipe right, previous slide
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Move slides horizontally
        onTouchStart={handleTouchStart} // Add touch start event
        onTouchEnd={handleTouchEnd} // Add touch end event
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={item.image}
              alt={item.alt}
              className="w-full object-cover rounded-lg p-2" // Adjust height for different screen sizes
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 border border-gray-300 text-black sm:block hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 border border-gray-300 text-black sm:block hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

"use client";

import dynamic from 'next/dynamic';

const galleryItems = [
  { id: 1, imageUrl: 'https://via.placeholder.com/300x200', title: 'Gallery Item 1' },
  { id: 2, imageUrl: 'https://via.placeholder.com/300x200', title: 'Gallery Item 2' },
  { id: 3, imageUrl: 'https://via.placeholder.com/300x200', title: 'Gallery Item 3' },
  { id: 4, imageUrl: 'https://via.placeholder.com/300x200', title: 'Gallery Item 4' },
];

const JoinTheTribe = () => {
  return (
    <section
      className="bg-gray-800 text-white py-16 px-4"
      style={{
        backgroundImage: "url('/back.png')",
        backgroundSize: 'cover', // Ensures the background image covers the full section
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h2 className="text-3xl font-bold text-center text-white mb-12">Join the Tribe</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="gallery-item bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ objectPosition: 'center' }} // Ensures the image is centered vertically and horizontally
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JoinTheTribe;

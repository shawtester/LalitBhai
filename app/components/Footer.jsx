'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-yellow-400">Nutribox</h2>
            <p className="text-sm">Your Health, Our Priority</p>
            <p className="text-xs text-gray-400">
              We provide high-quality supplements to boost your fitness and health journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
      <ul className="space-y-2 text-sm">
  <li><a href="/" className="hover:text-yellow-400">Home</a></li>
  <li><a href="/about" className="hover:text-yellow-400">About Us</a></li>
  <li><a href="/products" className="hover:text-yellow-400">Products</a></li>
  <li><a href="/contact" className="hover:text-yellow-400">Contact</a></li>
  <li><a href="/privacypolicy" className="hover:text-yellow-400">Privacy Policy</a></li>
  <li><a href="/termsandcondition" className="hover:text-yellow-400">Terms and Conditions</a></li>
</ul>

          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Newsletter</h3>
            <p className="text-sm">Subscribe to get the latest news and offers.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your Email"
                className="p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="py-2 px-4 bg-yellow-400 text-gray-800 font-semibold rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" className="text-white hover:text-blue-600 transition duration-300">
                <i className="fab fa-facebook-f text-2xl"></i>
              </a>
              <a href="https://instagram.com" className="text-white hover:text-pink-600 transition duration-300">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a href="https://twitter.com" className="text-white hover:text-blue-400 transition duration-300">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-600 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Nutribox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

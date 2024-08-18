import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../data/backImage.jpg'; // Replace with your actual image path

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header Section */}
      <header className="bg-white text-blue-500 py-4 z-20 fixed w-full">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold">CivicEngage</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/login" className="over:bg-blue-700">Login</Link>
              </li>
              <li>
                <Link to="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700">Sign Up</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-center pt-16"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-bold md:text-5xl leading-tight mb-4">
            Welcome to CivicEngage
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Empowering communities through enhanced civic participation and engagement.
          </p>
          <Link to="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">Join Us Today!</h3>
          <p className="mt-4 text-lg">
            Register now and be part of a community focused on positive civic engagement.
          </p>
          <div className="mt-8">
            <Link to="/sign-up" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-200">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} CivicEngage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

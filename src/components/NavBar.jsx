import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Real Estate
        </Link>

        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:text-indigo-200 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-indigo-200 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-indigo-200 transition">
              Contact
            </Link>
          </li>
        </ul>

        <Link
          to="/login"
          className="text-white bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

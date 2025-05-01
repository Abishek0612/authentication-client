import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 text-center w-full">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Real Estate. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

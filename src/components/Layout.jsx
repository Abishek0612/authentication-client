import React from "react";
import Footer from "./Footer";
import Navbar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {" "}
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

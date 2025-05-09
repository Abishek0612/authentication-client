import logo from "../assets/logoName.png";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white py-4 text-center w-full">
      <p className="text-sm flex items-center justify-center">
        &copy; {new Date().getFullYear()}{" "}
        <img src={logo} alt="Logo" className="h-4 mx-2 inline-block" /> All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

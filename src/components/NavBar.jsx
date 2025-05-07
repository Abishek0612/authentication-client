import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { currentUser, logout, loading, isFirstLogin } = useAuth();
  const location = useLocation();

  const needsPasswordReset =
    isFirstLogin || (currentUser && currentUser.isFirstLogin === true);

  const showNavigation = currentUser && !needsPasswordReset;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link
          to={
            currentUser
              ? needsPasswordReset
                ? "/first-time-password"
                : "/dashboard"
              : "/"
          }
          className="text-white text-2xl font-bold"
        >
          <img src={logo} alt="logo" className="h-8" />
        </Link>

        {showNavigation && (
          <ul className="hidden md:flex space-x-6 text-white font-medium">
            <li>
              <Link to="/" className="hover:text-indigo-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`hover:text-indigo-200 transition ${
                  location.pathname === "/dashboard"
                    ? "underline font-semibold"
                    : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`hover:text-indigo-200 transition ${
                  location.pathname === "/profile"
                    ? "underline font-semibold"
                    : ""
                }`}
              >
                Profile
              </Link>
            </li>
          </ul>
        )}

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              Hi, {currentUser.firstName || "User"}
              {needsPasswordReset && " (Password Reset Required)"}
            </span>
            <button
              onClick={logout}
              disabled={loading}
              className="text-white bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Loading..." : "Sign Out"}
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-white bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

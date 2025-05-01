import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { currentUser, logout, loading } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link
          to={currentUser ? "/dashboard" : "/"}
          className="text-white text-2xl font-bold"
        >
          Authentication App
        </Link>

        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:text-indigo-200 transition">
              Home
            </Link>
          </li>
          {currentUser && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-200 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-indigo-200 transition"
                >
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">Hi, {currentUser.name}</span>
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

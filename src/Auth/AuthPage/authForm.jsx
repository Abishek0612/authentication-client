import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Authentication failed";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-dark-gray)]">
      <div className="w-full lg:w-1/2 bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <img src={logo} alt="logo" className="h-8" />
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-dark-gray)] mb-1">
            Log in to your account
          </h1>
          <p className="text-sm text-[var(--color-gray)] mb-8">
            Please enter your details.
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-gray)] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-gray)] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 hover:text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 hover:text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[var(--color-gray)]"
                >
                  Remember me for 30 days
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-dark-purple)]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#4285F4] hover:bg-[#3367d6] text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-[#1a237e] text-white p-12 relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col justify-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Turn Clicks
            <br />
            Into Customers
            <br />
            <span className="font-light">Effortlessly</span>
          </h2>

          <div className="mt-16 bg-[#283593] p-6 rounded-lg">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm mb-4">
              The robust security measures of Nomo give us peace of mind. We
              trust the platform to safeguard our project data, ensuring
              confidentiality and compliance with data protection standards.
            </p>
            <div className="text-sm">
              <p className="font-medium">Shadi Elson</p>
              <p className="text-blue-200">IT Project Lead</p>
            </div>
          </div>
        </div>

        {/* Background curved shapes */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#283593] rounded-tl-full opacity-50"></div>
          <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-[#3949ab] rounded-bl-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

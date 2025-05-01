import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthForm = ({ isLogin, toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && password !== confirmPassword)) {
      setError(
        isLogin ? "Please fill in all fields" : "Passwords do not match"
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      alert(isLogin ? "Logged in successfully" : "Registered successfully");
      setIsLoading(false);
    }, 1500);
  };
  return (
    <div className="flex flex-col flex-grow items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign In" : "Register"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="text-blue-600 hover:text-blue-500 font-medium ml-1 cursor-pointer"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="text-center mt-2">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-500 font-medium text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />;
};

export default AuthPage;

// src/pages/Login.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthProvider.jsx";
import backgroundImage from "../assets/login_background_2.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";


const Login = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/game");
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      setMessage(error.message);
    } else {
      navigate("/game");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-20 z-0" />

      {/* Foreground content */}
      <div className="relative z-10">
        <ParcheesiHeader />

        {/* Main box wrapper */}
        <div className="flex items-center justify-center min-h-screen pt-10 px-4">
          <div className="flex bg-white rounded shadow-lg overflow-hidden max-w-4xl w-full">
            {/* Left side - Sign In */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">Sign In</h2>

              {/* Username or Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="text-sm font-medium mb-1 block"
                >
                  Username or Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. skibidisigmas123"
                  className="p-2 border rounded-lg w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="text-sm font-medium mb-1 block"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="e.g. sup3rh@rdPa$$word"
                  className="p-2 border rounded-lg w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-full mb-4"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-full"
                onClick={handleGoogleSignIn}
              >
                Login with Google
              </button>
              {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>

            {/* Right side - Sign Up */}
            <div className="w-1/2 bg-blue-100 p-8 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Login</h2>
              <p className="mb-6">Don’t have an account?</p>
              <a
                href="/signup"
                className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

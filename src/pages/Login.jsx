// src/pages/Login.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthProvider.jsx";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

const Login = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/Menu");
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      setMessage(error.message);
    } else {
      navigate("/Menu");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10">
        <ParcheesiHeader />
        <h1 className="text-white text-center text-5xl font-semibold absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          Chase, Race, Capture
        </h1>

        {/* Main box wrapper */}
        <div className="flex items-center justify-center min-h-screen pt-10 px-4">
          <div className="flex bg-[#D8F8F3] shadow-lg overflow-hidden max-w-4xl w-full">
            {/* Left side - Sign In */}
            <div className="w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-8 text-gray-800">Sign In</h2>

              {/* Username or Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="text-base font-medium mb-2 block text-gray-700"
                >
                  Username or Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. skibidisigmas123"
                  className="h-10 w-[375px] bg-[#CFEDE8] placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#50B4D4] rounded-full px-4 hover:brightness-95"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="text-base font-medium mb-2 block text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="e.g. sup3rh@rdPa$$word"
                  className="h-10 w-[375px] bg-[#CFEDE8] placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#50B4D4] rounded-full px-4 hover:brightness-95"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="h-10 w-[375px] bg-[#A3DEE7] text-black hover:brightness-95 rounded-full text-base"
                onClick={handleSignIn}
              >
                Log In
              </button>

              <div className="flex items-center my-4 w-[375px]">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-3 text-gray-500 text-sm">or</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 h-10 w-[375px] border border-gray-300 text-black bg-white rounded-full text-base hover:shadow-md transition"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                Log in with Google
              </button>

              {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>

            {/* Right side - Sign Up */}
            <div className="w-1/2 bg-[#A3DEE7] p-10 flex flex-col justify-center items-center text-center">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Welcome to Login
              </h2>
              <p className="mb-6 text-gray-700">Don’t have an account?</p>
              <a
                href="/signup"
                className="h-10 px-10 bg-[#CFEDE8] text-black hover:brightness-95 transition rounded-full flex items-center justify-center"
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

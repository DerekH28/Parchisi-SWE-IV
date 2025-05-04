// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../api/auth";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for verification.");
      navigate("/login");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Parcheesi Header */}
      <div className="mt-6">
        <ParcheesiHeader />
      </div>

      {/* Title */}
      <h1 className="text-white text-center text-5xl font-semibold absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        Chase, Race, Capture
      </h1>

      {/* Sign Up Box */}
      <div className="mt-40 bg-[#D8F8F3] px-6 py-8 rounded-none shadow-md w-105">
        <h2 className="text-4xl font-bold mb-6 text-center">Sign Up</h2>

        <form className="flex flex-col">
          {/* Email Label */}
          <label
            htmlFor="email"
            className="text-left text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            className="px-3.5 py-2 mb-4 rounded-full bg-[#CFEDE8] placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#50B4D4] hover:brightness-95"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Label */}
          <label
            htmlFor="password"
            className="text-left text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className="px-3.5 py-2 mb-6 rounded-full bg-[#CFEDE8] placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#50B4D4] hover:brightness-95"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-[#A3DEE7] text-black rounded-full hover:brightness-95 transition mb-2"
            onClick={handleSignUp}
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign Up Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 h-10 w-[400px] border border-gray-300 text-black bg-white rounded-full text-base hover:shadow-md transition"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-700 font-medium">
                Sign Up with Google
              </span>
            </button>
          </div>

          {/* Error Message */}
          {message && <p className="text-red-500 mt-2">{message}</p>}

          {/* Login Link */}
          <div className="flex justify-center">
            <p className="mt-6 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-500 underline hover:text-blue-700 transition-colors"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

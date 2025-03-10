// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../api/auth";

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
    <div className="flex flex-col items-center min-w-screen justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
      <form className="flex flex-col bg-white p-6 rounded shadow-md w-80">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded mb-2"
          onClick={handleGoogleSignIn}
        >
          Sign Up with Google
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <p className="mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

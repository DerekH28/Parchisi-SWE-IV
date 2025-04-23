// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthProvider.jsx";

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
    <div className="flex flex-col items-center justify-center min-w-screen min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
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
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded mb-2"
          onClick={handleSignIn}
        >
          Login
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded mb-2"
          onClick={handleGoogleSignIn}
        >
          Login with Google
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <p className="mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

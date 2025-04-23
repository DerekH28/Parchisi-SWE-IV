
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GamePage from "./pages/GamePage";
import { AuthProvider } from "./context/AuthProvider";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

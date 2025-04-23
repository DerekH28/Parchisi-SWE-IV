import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GamePage from "./pages/GamePage";
import { AuthProvider } from "./context/AuthProvider";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import MenuPage from "./pages/MenuPG";
import GameOptionsPage from "./pages/GameOptions";
import TutorialPage from "./pages/TutorialPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/Menu" element={<MenuPage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/GameOptions" element={<GamePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

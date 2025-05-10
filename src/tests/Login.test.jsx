// src/tests/Login.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";

// Mock react-router-dom's useNavigate
import * as RRDom from "react-router-dom";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock our AuthProvider's useAuth
import * as AuthCtx from "../context/AuthProvider";
vi.mock("../context/AuthProvider", async () => {
  const actual = await vi.importActual("../context/AuthProvider");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock auth API functions
import * as AuthApi from "../api/auth";
vi.mock("../api/auth", async () => {
  const actual = await vi.importActual("../api/auth");
  return {
    ...actual,
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
  };
});

import Login from "../pages/Login.jsx";

describe("Login Page", () => {
  let navigateMock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup navigate mock
    navigateMock = vi.fn();
    RRDom.useNavigate.mockReturnValue(navigateMock);

    // Default to no user logged in
    AuthCtx.useAuth.mockReturnValue({ user: null });
  });

  it("redirects to /Menu if user is already logged in", async () => {
    AuthCtx.useAuth.mockReturnValue({ user: { id: "u1", email: "a@b.com" } });
    render(<Login />);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/Menu");
    });
  });

  it("shows error on failed Google sign-in", async () => {
    render(<Login />);
    AuthApi.signInWithGoogle.mockResolvedValue({ error: { message: "Google failed" } });

    fireEvent.click(screen.getByRole("button", { name: /Log in with Google/i }));

    await waitFor(() => {
      expect(AuthApi.signInWithGoogle).toHaveBeenCalled();
      expect(screen.getByText(/Google failed/i)).toBeVisible();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it("does not navigate on successful Google sign-in", async () => {
    render(<Login />);
    AuthApi.signInWithGoogle.mockResolvedValue({ error: null });

    fireEvent.click(screen.getByRole("button", { name: /Log in with Google/i }));

    await waitFor(() => {
      expect(AuthApi.signInWithGoogle).toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});

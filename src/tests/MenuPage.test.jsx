// src/tests/MenuPage.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";

// 1) Mock react-router-dom's useNavigate
import * as RRDom from "react-router-dom";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// 2) Mock our AuthProvider's useAuth
import * as AuthCtx from "../context/AuthProvider";
vi.mock("../context/AuthProvider", async () => {
  const actual = await vi.importActual("../context/AuthProvider");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import MenuPage from "../pages/MenuPG.jsx";

describe("MenuPage", () => {
  let navigateMock;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Grab the mocked functions:
    // useNavigate returns our navigateMock
    navigateMock = vi.fn();
    RRDom.useNavigate.mockReturnValue(navigateMock);

    // useAuth returns a fake user
    AuthCtx.useAuth.mockReturnValue({ user: { email: "alice@example.com" } });
  });

  it("renders the welcome message using the email prefix", () => {
    render(<MenuPage />);
    expect(screen.getByText(/Welcome, alice/i)).toBeInTheDocument();
  });

  it("renders all three menu buttons", () => {
    render(<MenuPage />);
    expect(screen.getByRole("button", { name: /Start New Game/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /View Tutorial/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /^Settings$/i })).toBeVisible();
  });

  it("navigates to /lobby when 'Start New Game' is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /Start New Game/i }));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/lobby");
  });

  it("navigates to /tutorial when 'View Tutorial' is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /View Tutorial/i }));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/tutorial");
  });

  it("navigates to /Settings when 'Settings' is clicked", () => {
    render(<MenuPage />);
    fireEvent.click(screen.getByRole("button", { name: /^Settings$/i }));
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/Settings");
  });
});

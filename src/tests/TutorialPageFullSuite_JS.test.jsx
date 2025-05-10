// src/tests/TutorialPage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TutorialPage from "../pages/TutorialPage";

function renderTutorial() {
  window.history.pushState({}, "Tutorial", "/tutorial");
  return render(
    <MemoryRouter initialEntries={["/tutorial"]}>
      <Routes>
        <Route path="/tutorial" element={<TutorialPage />} />
      </Routes>
    </MemoryRouter>
  );
}

async function advanceByNext(n) {
  for (let i = 0; i < n; i++) {
    const nextBtn = await screen.findByRole("button", { name: /^NEXT$/i });
    fireEvent.click(nextBtn);
  }
}

describe("TutorialPage Flow", () => {
  beforeEach(() => {
    window.history.pushState({}, "Tutorial", "/tutorial");
  });

  it("after 3 NEXTs shows the Roll Dice button", async () => {
    renderTutorial();
    await advanceByNext(3);

    expect(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    ).toBeInTheDocument();
  });

  it("rolls [5,5] and displays two Use 5 buttons", async () => {
    renderTutorial();
    await advanceByNext(3);

    // Step 3: click the Roll Dice button
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );

    // Then two Use 5 buttons appear
    await waitFor(() => {
      const uses = screen.getAllByRole("button", { name: /^Use 5$/i });
      expect(uses).toHaveLength(2);
    });
  });

  it("uses both 5s then shows the second Roll Dice (step 5)", async () => {
    renderTutorial();
    await advanceByNext(3);

    // Step 3 → Roll Dice
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );

    // Step 4: click first Use 5, wait, then click second
    let use5 = await screen.findAllByRole("button", { name: /^Use 5$/i });
    expect(use5).toHaveLength(2);
    fireEvent.click(use5[0]);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^Use 5$/i })).toHaveLength(1)
    );
    fireEvent.click(screen.getByRole("button", { name: /^Use 5$/i }));

    // Step 5 → Roll Dice reappears
    expect(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    ).toBeInTheDocument();
  });

  it("rolls [6,4] immediately on Continue and shows Use 6 & Use 4", async () => {
    renderTutorial();
    await advanceByNext(3);

    // first roll & use 5s
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );
    let use5 = await screen.findAllByRole("button", { name: /^Use 5$/i });
    fireEvent.click(use5[0]);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^Use 5$/i })).toHaveLength(1)
    );
    fireEvent.click(screen.getByRole("button", { name: /^Use 5$/i }));

    // Step 5 → click Roll Dice again to roll [6,4]
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );

    // Now both Use 6 and Use 4 should appear
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^Use 6$/i })).toBeVisible();
      expect(screen.getByRole("button", { name: /^Use 4$/i })).toBeVisible();
    });
  });

  it("clicking Use 6 breaks blockade and advances past step 6", async () => {
    renderTutorial();
    await advanceByNext(3);

    // first roll & use 5s
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );
    let use5 = await screen.findAllByRole("button", { name: /^Use 5$/i });
    fireEvent.click(use5[0]);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^Use 5$/i })).toHaveLength(1)
    );
    fireEvent.click(screen.getByRole("button", { name: /^Use 5$/i }));

    // second roll
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );

    // break blockade
    fireEvent.click(await screen.findByRole("button", { name: /^Use 6$/i }));

    // Use 6 should no longer be in document
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /^Use 6$/i })
      ).toBeNull();
    });
  });

  it("clicking Use 4 does NOT advance the tutorial", async () => {
    renderTutorial();
    await advanceByNext(3);

    // first roll & use 5s
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );
    let use5 = await screen.findAllByRole("button", { name: /^Use 5$/i });
    fireEvent.click(use5[0]);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^Use 5$/i })).toHaveLength(1)
    );
    fireEvent.click(screen.getByRole("button", { name: /^Use 5$/i }));

    // second roll
    fireEvent.click(
      await screen.findByRole("button", { name: /^Roll Dice$/i })
    );

    // wrong die
    fireEvent.click(await screen.findByRole("button", { name: /^Use 4$/i }));

    // still at step 6: Use 6 remains
    expect(screen.getByRole("button", { name: /^Use 6$/i })).to
  });
});

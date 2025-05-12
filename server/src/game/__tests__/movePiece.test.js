import { describe, it, expect, beforeEach, vi } from "vitest";
import { movePiece } from "../movePiece.js";
import { gameState } from "../../utils/gameState.js";
import { routes } from "../../utils/routes.js";
import * as gameLogic from "../gameLogic.js";

// Mock the gameLogic module
vi.mock("../gameLogic.js", () => ({
  isOpponentOnSafeSpace: vi.fn(),
  isBlockadeOnPath: vi.fn(),
  captureOpponentAt: vi.fn(),
  checkForWin: vi.fn(),
  getHomeCoordinate: vi.fn(),
}));

describe("movePiece", () => {
  beforeEach(() => {
    // Reset gameState before each test
    Object.assign(gameState, {
      red: [],
      blue: [],
      yellow: [],
      green: [],
    });

    // Reset all mocks
    vi.clearAllMocks();
  });

  describe("with invalid player", () => {
    it("should return failure", () => {
      const result = movePiece("notAPlayer", "red1", 5, routes);
      expect(result).toHaveProperty("success", false);
    });
  });

  describe("when leaving home", () => {
    describe("with dice not 5", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
        ];
        const result = movePiece("red", "red1", 4, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
        ];
        const result = movePiece("red", "red1", 4, routes);
        expect(result.message).toMatch(/Must roll exactly 5 to leave home/);
      });
    });

    describe("with blockade at starting tile", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
          {
            inHome: false,
            index: 1,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
          {
            inHome: false,
            index: 2,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
          { inHome: false, index: 1, coord: { row: 3, col: 6 } },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        const result = movePiece("red", "red1", 5, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
          {
            inHome: false,
            index: 1,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
          {
            inHome: false,
            index: 2,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
          { inHome: false, index: 1, coord: { row: 3, col: 6 } },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        const result = movePiece("red", "red1", 5, routes);
        expect(result.message).toMatch(/Blockade at starting tile/);
      });
    });

    describe("with valid conditions", () => {
      it("should return success", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        const result = movePiece("red", "red1", 5, routes);
        expect(result.success).toBe(true);
      });

      it("should update piece state", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        movePiece("red", "red1", 5, routes);
        expect(gameState.red[0].inHome).toBe(false);
      });

      it("should set correct coordinates", () => {
        gameState.red = [
          {
            inHome: true,
            index: 0,
            coord: { row: 2, col: 2 },
            lastKnownIndex: -1,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        movePiece("red", "red1", 5, routes);
        expect(gameState.red[0].coord).toEqual({ row: 3, col: 6 });
      });
    });
  });

  describe("when moving on board", () => {
    describe("with invalid piece position", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(false);
        gameLogic.isBlockadeOnPath.mockReturnValue(true);

        const result = movePiece("red", "red1", 2, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(false);
        gameLogic.isBlockadeOnPath.mockReturnValue(true);

        const result = movePiece("red", "red1", 2, routes);
        expect(result.message).toMatch(/Move blocked by a blockade ahead/);
      });
    });

    describe("with dice roll exceeding remaining spaces", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 55,
          },
        ];
        const result = movePiece("red", "red1", 2, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 55,
          },
        ];
        const result = movePiece("red", "red1", 2, routes);
        expect(result.message).toMatch(/exceeds remaining spaces/);
      });
    });

    describe("with opponent on safe space", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 4, col: 6 } },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(true);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 4, col: 6 } },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(true);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.message).toMatch(
          /Cannot move to safe space occupied by opponent/
        );
      });
    });

    describe("with blockade ahead", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(true);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(true);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.message).toMatch(/Move blocked by a blockade ahead/);
      });
    });

    describe("with opponent blockade", () => {
      it("should return failure", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 4, col: 6 } },
          { inHome: false, index: 1, coord: { row: 4, col: 6 } },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(false);
        gameLogic.isBlockadeOnPath.mockReturnValue(true);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.success).toBe(false);
      });

      it("should return correct error message", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 4, col: 6 } },
          { inHome: false, index: 1, coord: { row: 4, col: 6 } },
        ];
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(false);
        gameLogic.isBlockadeOnPath.mockReturnValue(true);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.message).toMatch(/Move blocked by a blockade ahead/);
      });
    });

    describe("with valid move", () => {
      it("should return success", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);

        const result = movePiece("red", "red1", 1, routes);
        expect(result.success).toBe(true);
      });

      it("should update piece coordinates", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);

        movePiece("red", "red1", 1, routes);
        expect(gameState.red[0].coord).toEqual({ row: 4, col: 6 });
      });

      it("should update lastKnownIndex", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);

        movePiece("red", "red1", 1, routes);
        expect(gameState.red[0].lastKnownIndex).toBe(1);
      });
    });

    describe("when player wins", () => {
      it("should return success", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.checkForWin.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        const result = movePiece("red", "red1", 1, routes);
        expect(result.success).toBe(true);
      });

      it("should indicate win", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        gameLogic.isBlockadeOnPath.mockReturnValue(false);
        gameLogic.isOpponentOnSafeSpace.mockReturnValue(false);
        gameLogic.captureOpponentAt.mockReturnValue(true);
        gameLogic.checkForWin.mockReturnValue(true);
        gameLogic.getHomeCoordinate.mockReturnValue({ row: 3, col: 6 });

        const result = movePiece("red", "red1", 1, routes);
        expect(result.hasWon).toBe(true);
      });
    });
  });
});

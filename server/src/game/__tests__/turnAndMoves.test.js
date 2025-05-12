import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setActivePlayers,
  getNextTurn,
  activePlayers,
  resetTurn,
} from "../../utils/turnManager.js";
import {
  isValidDestination,
  canLeaveHome,
  canMoveOnBoard,
  hasValidMoves,
} from "../../utils/validMoves.js";
import { gameState } from "../../utils/gameState.js";
import { routes } from "../../utils/routes.js";

describe("Turn Manager", () => {
  beforeEach(() => {
    // Reset gameState before each test
    Object.assign(gameState, {
      red: [],
      blue: [],
      yellow: [],
      green: [],
    });
    // Reset active players
    activePlayers.length = 0;
    resetTurn();
  });

  it("should set active players", () => {
    setActivePlayers(["red", "blue"]);
    expect(activePlayers).toEqual(["red", "blue"]);
  });

  it("should get next turn", () => {
    setActivePlayers(["red", "blue"]);
    const mockIo = {};
    expect(getNextTurn(mockIo, "red")).toBe("blue");
    expect(getNextTurn(mockIo, "blue")).toBe("red");
  });

  it("should skip inactive players", () => {
    setActivePlayers(["red", "yellow"]);
    const mockIo = {};
    expect(getNextTurn(mockIo, "red")).toBe("yellow");
    expect(getNextTurn(mockIo, "yellow")).toBe("red");
  });
});

describe("Valid Moves", () => {
  beforeEach(() => {
    // Reset gameState before each test
    Object.assign(gameState, {
      red: [],
      blue: [],
      yellow: [],
      green: [],
    });
  });

  describe("isValidDestination", () => {
    it("should allow moving to empty space", () => {
      const coord = { row: 3, col: 6 };
      expect(isValidDestination(coord, "red")).toBe(true);
    });

    it("should prevent moving to space with opponent on safe space", () => {
      const coord = { row: 3, col: 6 };
      gameState.blue = [{ coord: { row: 3, col: 6 } }];
      expect(isValidDestination(coord, "red")).toBe(false);
    });

    it("should allow two pieces of same color on a space", () => {
      const coord = { row: 3, col: 6 };
      gameState.red = [
        { coord: { row: 3, col: 6 } },
        { coord: { row: 3, col: 6 } },
      ];
      expect(isValidDestination(coord, "red")).toBe(false);
    });

    it("should allow leaving home even if opponent on safe space", () => {
      const coord = { row: 3, col: 6 };
      gameState.blue = [{ coord: { row: 3, col: 6 } }];
      expect(isValidDestination(coord, "red", true)).toBe(true);
    });
  });

  describe("canLeaveHome", () => {
    it("should return false if piece not in home", () => {
      const piece = { inHome: false };
      expect(canLeaveHome(piece, [5], "red")).toBe(false);
    });

    it("should return false if no 5 in dice", () => {
      const piece = { inHome: true };
      expect(canLeaveHome(piece, [3, 4], "red")).toBe(false);
    });

    it("should return true if piece in home and has 5", () => {
      const piece = { inHome: true };
      gameState.red = [];
      expect(canLeaveHome(piece, [5], "red")).toBe(true);
    });

    it("should return true if sum of dice equals 5", () => {
      const piece = { inHome: true };
      gameState.red = [];
      expect(canLeaveHome(piece, [2, 3], "red")).toBe(true);
    });
  });

  describe("canMoveOnBoard", () => {
    it("should return false if piece at end of path", () => {
      const lastIndex = routes.red.path.length - 1;
      const piece = {
        lastKnownIndex: lastIndex,
        coord: routes.red.path[lastIndex],
      };
      expect(canMoveOnBoard(piece, 1, routes.red.path, "red")).toBe(false);
    });

    it("should return false if destination is blocked", () => {
      const piece = { lastKnownIndex: 0 };
      gameState.red = [
        { coord: routes.red.path[1] },
        { coord: routes.red.path[1] },
      ];
      expect(canMoveOnBoard(piece, 1, routes.red.path, "red")).toBe(false);
    });

    it("should return true if move is valid", () => {
      const piece = { lastKnownIndex: 0 };
      expect(canMoveOnBoard(piece, 1, routes.red.path, "red")).toBe(true);
    });

    it("should handle moves near end of path", () => {
      const piece = { lastKnownIndex: 50 }; // Second to last position
      expect(canMoveOnBoard(piece, 1, routes.red.path, "red")).toBe(true);
    });
  });

  describe("hasValidMoves", () => {
    it("should return false if player not in game", () => {
      expect(hasValidMoves("purple", [5])).toBe(false);
    });

    it("should return true if piece can leave home", () => {
      gameState.red = [
        {
          inHome: true,
          coord: { row: 2, col: 2 },
          lastKnownIndex: -1,
        },
      ];
      expect(hasValidMoves("red", [5])).toBe(true);
    });

    it("should return true if piece can move on board", () => {
      gameState.red = [
        {
          inHome: false,
          coord: routes.red.path[0],
          lastKnownIndex: 0,
        },
      ];
      expect(hasValidMoves("red", [1])).toBe(true);
    });

    it("should return false if no valid moves", () => {
      const lastIndex = routes.red.path.length - 1;
      gameState.red = [
        {
          inHome: false,
          coord: routes.red.path[lastIndex], // Last position in path
          lastKnownIndex: lastIndex,
        },
        {
          inHome: true,
          coord: { row: 2, col: 2 },
          lastKnownIndex: -1,
        },
      ];
      expect(hasValidMoves("red", [3, 4])).toBe(false);
    });

    it("should handle multiple pieces with different valid moves", () => {
      gameState.red = [
        {
          inHome: false,
          coord: routes.red.path[0],
          lastKnownIndex: 0,
        },
        {
          inHome: true,
          coord: { row: 2, col: 2 },
          lastKnownIndex: -1,
        },
      ];
      expect(hasValidMoves("red", [1, 5])).toBe(true);
    });
  });
});

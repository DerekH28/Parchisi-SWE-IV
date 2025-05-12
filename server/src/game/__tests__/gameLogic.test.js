import {
  rollDice,
  isSafeSpace,
  isOpponentOnSafeSpace,
  checkForWin,
  getHomeCoordinate,
  isBlockadeOnPath,
  captureOpponentAt,
} from "../gameLogic.js";
import { gameState } from "../../utils/gameState.js";
import { routes } from "../../utils/routes.js";

describe("Game Logic", () => {
  beforeEach(() => {
    // Reset gameState before each test
    Object.assign(gameState, {
      red: [],
      blue: [],
      yellow: [],
      green: [],
    });
  });

  describe("rollDice", () => {
    describe("when it's player's turn", () => {
      it("should return success and two numbers between 1 and 6", () => {
        const result = rollDice("red", "red", { red: [] });
        expect(result.success).toBe(true);
      });

      it("should return two dice values between 1 and 6", () => {
        const result = rollDice("red", "red", { red: [] });
        expect(result.dice).toHaveLength(2);
      });

      it("should return dice values within valid range", () => {
        const result = rollDice("red", "red", { red: [] });
        result.dice.forEach((value) => {
          expect(value).toBeGreaterThanOrEqual(1);
          expect(value).toBeLessThanOrEqual(6);
        });
      });
    });

    describe("when it's not player's turn", () => {
      it("should return failure", () => {
        const result = rollDice("red", "blue", { red: [] });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("getHomeCoordinate", () => {
    describe("for red player", () => {
      it("should return correct home coordinate", () => {
        expect(getHomeCoordinate("red", 0)).toEqual({ row: 2, col: 2 });
      });
    });

    describe("for blue player", () => {
      it("should return correct home coordinate", () => {
        expect(getHomeCoordinate("blue", 1)).toEqual({ row: 2, col: 12 });
      });
    });

    describe("for yellow player", () => {
      it("should return correct home coordinate", () => {
        expect(getHomeCoordinate("yellow", 2)).toEqual({ row: 12, col: 2 });
      });
    });

    describe("for green player", () => {
      it("should return correct home coordinate", () => {
        expect(getHomeCoordinate("green", 3)).toEqual({ row: 12, col: 12 });
      });
    });
  });

  describe("isBlockadeOnPath", () => {
    describe("when no blockade exists", () => {
      it("should return false", () => {
        gameState.red = [
          {
            inHome: false,
            index: 0,
            coord: { row: 3, col: 6 },
            lastKnownIndex: 0,
          },
          {
            inHome: false,
            index: 1,
            coord: { row: 3, col: 7 },
            lastKnownIndex: 1,
          },
        ];
        gameState.blue = [
          {
            inHome: false,
            index: 0,
            coord: { row: 4, col: 6 },
            lastKnownIndex: 0,
          },
          {
            inHome: false,
            index: 1,
            coord: { row: 4, col: 7 },
            lastKnownIndex: 1,
          },
        ];
        const path = [
          { row: 3, col: 6 },
          { row: 4, col: 6 },
          { row: 5, col: 6 },
        ];
        expect(isBlockadeOnPath(path, 0, 2, "red")).toBe(false);
      });
    });

    describe("when a blockade exists", () => {
      it("should return true", () => {
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
        const path = [
          { row: 3, col: 6 },
          { row: 4, col: 6 },
          { row: 5, col: 6 },
        ];
        expect(isBlockadeOnPath(path, 0, 2, "red")).toBe(true);
      });
    });
  });

  describe("captureOpponentAt", () => {
    describe("when single opponent piece exists", () => {
      it("should capture the opponent piece", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          {
            inHome: false,
            index: 0,
            coord: { row: 4, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        expect(captureOpponentAt({ row: 4, col: 6 }, "red")).toBe(true);
      });

      it("should send opponent piece home", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          {
            inHome: false,
            index: 0,
            coord: { row: 4, col: 6 },
            lastKnownIndex: 0,
          },
        ];
        captureOpponentAt({ row: 4, col: 6 }, "red");
        expect(gameState.blue[0].inHome).toBe(true);
      });
    });

    describe("when multiple opponent pieces exist", () => {
      it("should return false", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 4, col: 6 } },
          { inHome: false, index: 1, coord: { row: 4, col: 6 } },
        ];
        expect(captureOpponentAt({ row: 4, col: 6 }, "red")).toBe(false);
      });
    });

    describe("when no opponent exists at coordinate", () => {
      it("should return true", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 5, col: 6 } },
        ];
        expect(captureOpponentAt({ row: 4, col: 6 }, "red")).toBe(true);
      });
    });
  });

  describe("isSafeSpace", () => {
    describe("for a safe space", () => {
      it("should return true", () => {
        expect(isSafeSpace(3, 6)).toBe(true);
      });
    });

    describe("for a non-safe space", () => {
      it("should return false", () => {
        expect(isSafeSpace(0, 0)).toBe(false);
      });
    });
  });

  describe("isOpponentOnSafeSpace", () => {
    describe("when opponent is on safe space", () => {
      it("should return true", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        expect(isOpponentOnSafeSpace({ row: 3, col: 6 }, "red")).toBe(true);
      });
    });

    describe("when no opponent is on safe space", () => {
      it("should return false", () => {
        gameState.red = [
          { inHome: false, index: 0, coord: { row: 3, col: 6 } },
        ];
        gameState.blue = [
          { inHome: false, index: 0, coord: { row: 5, col: 6 } },
        ];
        expect(isOpponentOnSafeSpace({ row: 3, col: 6 }, "red")).toBe(false);
      });
    });
  });

  describe("checkForWin", () => {
    describe("when all pieces are at the end", () => {
      it("should return true", () => {
        gameState.red = [
          { inHome: false, lastKnownIndex: 51 },
          { inHome: false, lastKnownIndex: 51 },
          { inHome: false, lastKnownIndex: 51 },
          { inHome: false, lastKnownIndex: 51 },
        ];
        expect(checkForWin("red")).toBe(true);
      });
    });

    describe("when not all pieces are at the end", () => {
      it("should return false", () => {
        gameState.red = [
          { inHome: false, lastKnownIndex: 51 },
          { inHome: false, lastKnownIndex: 50 },
          { inHome: false, lastKnownIndex: 51 },
          { inHome: false, lastKnownIndex: 51 },
        ];
        expect(checkForWin("red")).toBe(false);
      });
    });
  });
});

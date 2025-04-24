import { describe, it, expect, beforeEach } from 'vitest';
import { movePiece } from '../game/movePiece';
import { gameState } from '../utils/gameState';
import { routes } from '../utils/routes';

describe('movePiece', () => {
    beforeEach(() => {
        // Reset gameState to initial state before each test
        Object.assign(gameState, {
            red: [
                { inHome: true, coord: { row: 2, col: 2 }, index: 0 },
                { inHome: true, coord: { row: 2, col: 3 }, index: 1 },
                { inHome: true, coord: { row: 3, col: 2 }, index: 2 },
                { inHome: true, coord: { row: 3, col: 3 }, index: 3 },
            ],
            blue: [
                { inHome: false, coord: routes.red.path[1], index: 0 },
                { inHome: true, coord: { row: 2, col: 12 }, index: 1 },
                { inHome: true, coord: { row: 3, col: 11 }, index: 2 },
                { inHome: true, coord: { row: 3, col: 12 }, index: 3 },
            ],
            yellow: [
                { inHome: true, coord: { row: 11, col: 2 }, index: 0 },
                { inHome: true, coord: { row: 11, col: 3 }, index: 1 },
                { inHome: true, coord: { row: 12, col: 2 }, index: 2 },
                { inHome: true, coord: { row: 12, col: 3 }, index: 3 },
            ],
            green: [
                { inHome: true, coord: { row: 11, col: 11 }, index: 0 },
                { inHome: true, coord: { row: 11, col: 12 }, index: 1 },
                { inHome: true, coord: { row: 12, col: 11 }, index: 2 },
                { inHome: true, coord: { row: 12, col: 12 }, index: 3 },
            ],
            dice: {
                die1: { value: null, played: false },
                die2: { value: null, played: false },
            }
        });
    });

    it('blocks moving from home without rolling 5 - success check', () => {
        const result = movePiece('red', 'red1', 3, routes);
        expect(result.success).toBe(false);
    });

    it('blocks moving from home without rolling 5 - message check', () => {
        const result = movePiece('red', 'red1', 3, routes);
        expect(result.message).toMatch(/must roll exactly 5/i);
    });

    it('allows moving from home with 5 - success check', () => {
        const result = movePiece('red', 'red1', 5, routes);
        expect(result.success).toBe(true);
    });

    it('allows moving from home with 5 - piece leaves home', () => {
        movePiece('red', 'red1', 5, routes);
        expect(gameState.red[0].inHome).toBe(false);
    });

    it('allows moving from home with 5 - updates coord', () => {
        movePiece('red', 'red1', 5, routes);
        expect(gameState.red[0].coord).toEqual(routes.red.path[0]);
    });

    it('captures single opponent piece - success', () => {
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[0],
            lastKnownIndex: 0,
            index: 0,
        };
        const result = movePiece('red', 'red1', 1, routes);
        expect(result.success).toBe(true);
    });

    it('captures single opponent piece - opponent sent home', () => {
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[0],
            lastKnownIndex: 0,
            index: 0,
        };
        movePiece('red', 'red1', 1, routes);
        expect(gameState.blue[0].inHome).toBe(true);
    });

    it('captures single opponent piece - coord updated', () => {
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[0],
            lastKnownIndex: 0,
            index: 0,
        };
        movePiece('red', 'red1', 1, routes);
        expect(gameState.red[0].coord).toEqual(routes.red.path[1]);
    });

    it('blocks overshooting the final stretch - success', () => {
        const finalIndex = routes.red.path.length - 1;
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[finalIndex - 1],
            lastKnownIndex: finalIndex - 1,
            index: 0,
        };
        const result = movePiece('red', 'red1', 2, routes);
        expect(result.success).toBe(false);
    });

    it('blocks overshooting the final stretch - message', () => {
        const finalIndex = routes.red.path.length - 1;
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[finalIndex - 1],
            lastKnownIndex: finalIndex - 1,
            index: 0,
        };
        const result = movePiece('red', 'red1', 2, routes);
        expect(result.message).toMatch(/exceeds/i);
    });

    it('fails if the player is invalid', () => {
        const result = movePiece("purple", "purple1", 5, routes);
        expect(result.success).toBe(false);
    });

    it('fails if piece index is out of bounds', () => {
        const result = movePiece("red", "red5", 5, routes);
        expect(result.message).toMatch(/invalid piece/i);
    });

    it("fails if piece position is not on path", () => {
        gameState.red[0] = {
            inHome: false,
            coord: { row: 99, col: 99 },
            index: 0
        };
        const result = movePiece("red", "red1", 1, routes);
        expect(result.message).toMatch(/position invalid/i);
    });

    it('blocks move when opponent has a blockade - success', () => {
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[0],
            lastKnownIndex: 0,
            index: 0,
        };
        gameState.blue[0].coord = routes.red.path[1];
        gameState.blue[1] = {
            inHome: false,
            coord: routes.red.path[1],
            index: 1,
        };

        const result = movePiece('red', 'red1', 1, routes);
        expect(result.success).toBe(false);
    });

    it('blocks move when opponent has a blockade - message', () => {
        gameState.red[0] = {
            inHome: false,
            coord: routes.red.path[0],
            lastKnownIndex: 0,
            index: 0,
        };
        gameState.blue[0].coord = routes.red.path[1];
        gameState.blue[1] = {
            inHome: false,
            coord: routes.red.path[1],
            index: 1,
        };

        const result = movePiece('red', 'red1', 1, routes);
        expect(result.message).toMatch(/blockade/i);
    });
});

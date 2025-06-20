import { describe, it, expect, beforeEach } from 'vitest';
import { isValidDestination } from '../game/isValidDestination';
import { gameState } from '../utils/gameState';
import { routes } from '../utils/routes';
import { safeSpaces } from '../utils/safeSpaces';

describe('isValidDestination', () => {
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
                { inHome: true, coord: { row: 2, col: 11 }, index: 0 },
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

    it('allows move to empty tile', () => {
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });

    it('allows move to a tile with one own piece', () => {
        gameState.red[0] = {
            inHome: false,
            coord: { row: 4, col: 4 },
            lastKnownIndex: 0,
            index: 0,
        };
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });

    it('allows move to opponent on safe space if leaving home', () => {
        gameState.blue[0].coord = { row: 3, col: 6 };
        gameState.blue[0].inHome = false;
        expect(isValidDestination({ row: 3, col: 6 }, 'red', true)).toBe(true);
    });

    it('allows move to empty safe space', () => {
        expect(isValidDestination({ row: 3, col: 6 }, 'red')).toBe(true);
    });

    it('allows move to non-safe space with opponent', () => {
        gameState.blue[0].coord = { row: 4, col: 4 };
        gameState.blue[0].inHome = false;
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });

    it('blocks move to safe space with opponent when not leaving home', () => {
        gameState.blue[0].coord = { row: 3, col: 6 };
        gameState.blue[0].inHome = false;
        expect(isValidDestination({ row: 3, col: 6 }, 'red')).toBe(false);
    });

    it('blocks move to tile with two own pieces', () => {
        gameState.red[0] = {
            inHome: false,
            coord: { row: 4, col: 4 },
            lastKnownIndex: 0,
            index: 0,
        };
        gameState.red[1] = {
            inHome: false,
            coord: { row: 4, col: 4 },
            lastKnownIndex: 0,
            index: 1,
        };
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(false);
    });
});

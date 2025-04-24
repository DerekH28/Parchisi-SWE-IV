import { describe, it, expect, beforeEach } from 'vitest';
import { isValidDestination } from '../game/isValidDestination';
import { initialGameState } from '../utils/gameState';
import { routes } from '../utils/routes';
import { safeSpaces } from '../utils/safeSpaces';

describe('isValidDestination', () => {
    beforeEach(() => {
        global.gameState = JSON.parse(JSON.stringify(initialGameState));
        global.routes = routes;
        global.safeSpaces = safeSpaces;
    });

    it('allows move to empty tile', () => {
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });

    it('allows move to a tile with one own piece', () => {
        global.gameState.red[0] = {
            inHome: false,
            coord: { row: 4, col: 4 },
            lastKnownIndex: 0,
            index: 0,
        };
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });


    it('allows move to opponent on safe space if leaving home', () => {
        global.gameState.blue[0].coord = { row: 3, col: 6 };
        global.gameState.blue[0].inHome = false;
        expect(isValidDestination({ row: 3, col: 6 }, 'red', true)).toBe(true);
    });

    it('allows move to empty safe space', () => {
        expect(isValidDestination({ row: 3, col: 6 }, 'red')).toBe(true);
    });

    it('allows move to non-safe space with opponent', () => {
        global.gameState.blue[0].coord = { row: 4, col: 4 };
        global.gameState.blue[0].inHome = false;
        expect(isValidDestination({ row: 4, col: 4 }, 'red')).toBe(true);
    });
});

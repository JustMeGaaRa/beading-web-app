import { test, expect } from "vitest";
import { DefaultGridStyles } from "../../src";
import { getCellAtPosition, getCellsInBounds } from "../../src/utils/hittest";
import {
    Square3x3GridWithCellsOnDiagonal,
    Square10x10EmptyGrid,
} from "../constants";

test.each([
    [
        {
            cursor: { x: 0, y: 0 },
            hitCells: [{ offset: { columnIndex: 0, rowIndex: 0 }, color: "" }],
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 10, y: 10 },
            hitCells: [{ offset: { columnIndex: 0, rowIndex: 0 }, color: "" }],
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 26, y: 32 },
            hitCells: [{ offset: { columnIndex: 1, rowIndex: 1 }, color: "" }],
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 259, y: 319 },
            hitCells: [{ offset: { columnIndex: 9, rowIndex: 9 }, color: "" }],
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 260, y: 320 },
            hitCells: [],
            successfull: false,
        },
    ],
    [
        {
            cursor: { x: -10, y: -10 },
            hitCells: [],
            successfull: false,
        },
    ],
    [
        {
            cursor: { x: 312, y: 384 },
            hitCells: [],
            successfull: false,
        },
    ],
])(
    "hitTestCursor should return successfull ($successfull) and cell count ($hitCells.length) at cursor ($cursor.x, $cursor.y)",
    ({ cursor, hitCells, successfull }) => {
        const grid = Square10x10EmptyGrid;
        const gridStyles = DefaultGridStyles;

        const hitResult = getCellAtPosition(grid, gridStyles, cursor);

        expect(hitResult).toBeDefined();
        expect(hitResult.successfull).toBe(successfull);
        expect(hitResult.hits).toHaveLength(hitCells.length);
        expect(hitResult.hits).toEqual(hitCells);
    }
);

test.each([
    {
        area: {
            position: { x: -10, y: -10 },
            height: 32 + 20,
            width: 26 + 20,
        },
        hitCells: Square3x3GridWithCellsOnDiagonal.cells.slice(0, 1),
        successfull: true,
    },
    {
        area: {
            position: { x: -10, y: -10 },
            height: 64 + 20,
            width: 52 + 20,
        },
        hitCells: Square3x3GridWithCellsOnDiagonal.cells.slice(0, 2),
        successfull: true,
    },
    {
        area: {
            position: { x: -10, y: -10 },
            height: 96 + 20,
            width: 78 + 20,
        },
        hitCells: Square3x3GridWithCellsOnDiagonal.cells.slice(0, 3),
        successfull: true,
    },
    {
        area: {
            position: { x: 0, y: 0 },
            height: 32,
            width: 26,
        },
        hitCells: Square3x3GridWithCellsOnDiagonal.cells.slice(0, 1),
        successfull: true,
    },
    {
        area: {
            position: { x: 26, y: 0 },
            height: 32,
            width: 26,
        },
        hitCells: [],
        successfull: false,
    },
    {
        area: {
            position: { x: 26, y: 0 },
            height: 96,
            width: 26,
        },
        hitCells: Square3x3GridWithCellsOnDiagonal.cells.slice(1, 2),
        successfull: true,
    },
])(
    "hitTestArea should return successfull ($successfull) and cell count ($hitCells.length) in area ($area.x, $area.y, $area.height, $area.width)",
    ({ area, hitCells, successfull }) => {
        const grid = Square3x3GridWithCellsOnDiagonal;
        const gridStyles = DefaultGridStyles;

        const hitResult = getCellsInBounds(grid, gridStyles, area);

        expect(hitResult).toBeDefined();
        expect(hitResult.successfull).toBe(successfull);
        expect(hitResult.hits).toHaveLength(hitCells.length);
        expect(hitResult.hits).toEqual(hitCells);
    }
);

import { test, expect } from "vitest";
import {
    BeadingGridState,
    BeadingGridStyles,
    DefaultGridStyles,
    ONE_SIX_BY_ONE_THREE,
} from "../../src";
import { hitTestCursor, hitTestArea } from "../../src/utils/hittest";
import { Square3x3GridWithCells } from "../constants";

test.each([
    [
        {
            cursor: { x: 0, y: 0 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 0, rowIndex: 0 },
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 10, y: 10 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 0, rowIndex: 0 },
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 26, y: 32 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 1, rowIndex: 1 },
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 259, y: 319 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 9, rowIndex: 9 },
            successfull: true,
        },
    ],
    [
        {
            cursor: { x: 260, y: 320 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 10, rowIndex: 10 },
            successfull: false,
        },
    ],
    [
        {
            cursor: { x: -10, y: -10 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: -1, rowIndex: -1 },
            successfull: false,
        },
    ],
    [
        {
            cursor: { x: 312, y: 384 },
            offset: { columnIndex: 0, rowIndex: 0 },
            hit: { columnIndex: 12, rowIndex: 12 },
            successfull: false,
        },
    ],
    [
        {
            cursor: { x: 312, y: 384 },
            offset: { columnIndex: 2, rowIndex: 5 },
            hit: { columnIndex: 12, rowIndex: 12 },
            successfull: false,
        },
    ],
])(
    "should be $successfull for grid in ($offset.columnIndex, $offset.rowIndex) with cursor in ($cursor.x, $cursor.y)",
    ({ cursor, offset, hit, successfull }) => {
        const grid: BeadingGridState = {
            name: "Test Grid",
            offset: offset,
            cells: [],
            options: {
                type: "square",
                height: 10,
                width: 10,
            },
        };
        const styles: BeadingGridStyles = DefaultGridStyles;

        const hitResult = hitTestCursor(grid, styles, cursor);

        expect(hitResult).toBeDefined();
        expect(hitResult.successfull).toBe(successfull);
        expect(hitResult.hitResult[0]!.offset).toEqual(hit);
    }
);

test.each([[]])("should ...", () => {
    const grid = Square3x3GridWithCells;
    const gridStyles = DefaultGridStyles;
    const selectedArea = {
        x: -10,
        y: -10,
        height: 100,
        width: 100,
    };

    const hitResult = hitTestArea(grid, gridStyles, selectedArea);

    expect(hitResult).toBeDefined();
});

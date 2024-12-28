import { expect, test } from "vitest";
import { Square3x3GridWithCells } from "../constants";
import { gridSetCell } from "../../src";

test.each([
    [{ color: "blue", offset: { columnIndex: 0, rowIndex: 0 }, count: 1 }],
    [{ color: "read", offset: { columnIndex: 1, rowIndex: 0 }, count: 1 }],
    [{ color: "green", offset: { columnIndex: 2, rowIndex: 2 }, count: 1 }],
    [{ color: "green", offset: { columnIndex: -1, rowIndex: -2 }, count: 0 }],
    [{ color: "green", offset: { columnIndex: 5, rowIndex: 5 }, count: 0 }],
    [{ color: "", offset: { columnIndex: 1, rowIndex: 1 }, count: 0 }],
])(
    "should have $count cell ($color, $offset.columnIndex, $offset.rowIndex)",
    ({ color, offset, count }) => {
        const modifiedGrid = gridSetCell(Square3x3GridWithCells, {
            offset,
            color,
        });

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.cells).toBeDefined();
        expect(
            modifiedGrid.cells.filter(
                (cell) =>
                    cell.offset.columnIndex === offset.columnIndex &&
                    cell.offset.rowIndex === offset.rowIndex &&
                    cell.color === color
            )
        ).toHaveLength(count);
    }
);

test.each([
    [{ color: "", offset: { columnIndex: 0, rowIndex: 0 } }],
    [{ color: "", offset: { columnIndex: 1, rowIndex: 1 } }],
    [{ color: "", offset: { columnIndex: 2, rowIndex: 2 } }],
])(
    "should remove the existing cell at ($offset.columnIndex, $offset.rowIndex)",
    ({ color, offset }) => {
        const modifiedGrid = gridSetCell(Square3x3GridWithCells, {
            offset,
            color,
        });

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.cells).toBeDefined();
        expect(
            modifiedGrid.cells.filter(
                (cell) =>
                    cell.offset.columnIndex !== offset.columnIndex &&
                    cell.offset.rowIndex !== offset.rowIndex
            )
        ).toHaveLength(Square3x3GridWithCells.cells.length - 1);
    }
);

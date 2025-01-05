import { expect, test } from "vitest";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { gridSetCellReducer } from "../../src";

test.each([
    [{ color: "blue", offset: { columnIndex: 0, rowIndex: 0 }, count: 1 }],
    [{ color: "read", offset: { columnIndex: 1, rowIndex: 0 }, count: 1 }],
    [{ color: "green", offset: { columnIndex: 2, rowIndex: 2 }, count: 1 }],
    [{ color: "green", offset: { columnIndex: -1, rowIndex: -2 }, count: 0 }],
    [{ color: "green", offset: { columnIndex: 5, rowIndex: 5 }, count: 0 }],
    [{ color: "", offset: { columnIndex: 1, rowIndex: 1 }, count: 0 }],
])(
    "should have cell count ($count) for cell ($color, $offset.columnIndex, $offset.rowIndex)",
    ({ color, offset, count }) => {
        const modifiedGrid = gridSetCellReducer(
            Square3x3GridWithCellsOnDiagonal,
            {
                offset,
                color,
            }
        );

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

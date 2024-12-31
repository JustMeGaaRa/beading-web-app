import { expect, test } from "vitest";
import { Square3x3GridWithCells } from "../constants";
import { gridSetCellReducer } from "../../src";

test.each([
    [{ color: "", offset: { columnIndex: 0, rowIndex: 0 } }],
    [{ color: "", offset: { columnIndex: 1, rowIndex: 1 } }],
    [{ color: "", offset: { columnIndex: 2, rowIndex: 2 } }],
])(
    "should remove the existing cell at ($offset.columnIndex, $offset.rowIndex)",
    ({ color, offset }) => {
        const modifiedGrid = gridSetCellReducer(Square3x3GridWithCells, {
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

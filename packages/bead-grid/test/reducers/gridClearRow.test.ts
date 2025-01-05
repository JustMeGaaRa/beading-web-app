import { expect, test } from "vitest";
import { gridClearRowReducer } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachRowMatchesCellCount } from "../helpers";

test.each([
    [{ clearRowIndex: 0, rowCellCount: [0, 1, 1] }],
    [{ clearRowIndex: 1, rowCellCount: [1, 0, 1] }],
    [{ clearRowIndex: 2, rowCellCount: [1, 1, 0] }],
    [{ clearRowIndex: -1, rowCellCount: [1, 1, 1] }],
    [{ clearRowIndex: 10, rowCellCount: [1, 1, 1] }],
])(
    "should not have any cells at row ($clearRowIndex) after clearing row",
    ({ clearRowIndex, rowCellCount }) => {
        const modifiedGrid = gridClearRowReducer(
            Square3x3GridWithCellsOnDiagonal,
            clearRowIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(
            modifiedGrid.cells.filter(
                (cell) => cell.offset.rowIndex === clearRowIndex
            ),
            "should have old row with no cells"
        ).toHaveLength(0);
        expect(
            eachRowMatchesCellCount(modifiedGrid, rowCellCount),
            "should have matching number of cells in each row"
        ).toBe(true);
    }
);

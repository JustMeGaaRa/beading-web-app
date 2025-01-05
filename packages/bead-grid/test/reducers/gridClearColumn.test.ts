import { expect, test } from "vitest";
import { gridClearColumnReducer } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachColumnMatchesCellCount } from "../helpers";

test.each([
    [{ clearColumnIndex: 0, columnCellCount: [0, 1, 1] }],
    [{ clearColumnIndex: 1, columnCellCount: [1, 0, 1] }],
    [{ clearColumnIndex: 2, columnCellCount: [1, 1, 0] }],
    [{ clearColumnIndex: -1, columnCellCount: [1, 1, 1] }],
    [{ clearColumnIndex: 10, columnCellCount: [1, 1, 1] }],
])(
    "should not have any cells at column ($clearColumnIndex) after clearing column",
    ({ clearColumnIndex, columnCellCount }) => {
        const modifiedGrid = gridClearColumnReducer(
            Square3x3GridWithCellsOnDiagonal,
            clearColumnIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(
            modifiedGrid.cells.filter(
                (cell) => cell.offset.columnIndex === clearColumnIndex
            ),
            "should have old column with no cells"
        ).toHaveLength(0);
        expect(
            eachColumnMatchesCellCount(modifiedGrid, columnCellCount),
            "should have matching number of cells in each column"
        ).toBe(true);
    }
);

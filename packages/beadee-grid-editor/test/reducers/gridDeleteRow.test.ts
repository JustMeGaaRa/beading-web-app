import { expect, test } from "vitest";
import { gridDeleteRow } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachRowMatchesCellCount } from "../helpers";

test.each([
    [{ deleteRowIndex: 0, rowCellCount: [1, 1] }],
    [{ deleteRowIndex: 1, rowCellCount: [1, 1] }],
    [{ deleteRowIndex: 2, rowCellCount: [1, 1] }],
])(
    "should delete row at index ($deleteRowIndex), decrease height by 1, and shift all cells",
    ({ deleteRowIndex, rowCellCount }) => {
        const modifiedGrid = gridDeleteRow(
            Square3x3GridWithCellsOnDiagonal,
            deleteRowIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.height).toBe(
            Square3x3GridWithCellsOnDiagonal.options.height - 1
        );
        expect(
            eachRowMatchesCellCount(modifiedGrid, rowCellCount),
            "should have matching number of cells in each row"
        ).toBe(true);
    }
);

test.each([[{ deleteRowIndex: -1 }], [{ deleteRowIndex: 10 }]])(
    "should return the same grid when deleting row at invalid index ($deleteRowIndex)",
    ({ deleteRowIndex }) => {
        const modifiedGrid = gridDeleteRow(
            Square3x3GridWithCellsOnDiagonal,
            deleteRowIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.height).toBe(
            Square3x3GridWithCellsOnDiagonal.options.height
        );
        expect(modifiedGrid).toBe(Square3x3GridWithCellsOnDiagonal);
    }
);

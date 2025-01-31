import { expect, test } from "vitest";
import { gridDeleteColumn } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachColumnMatchesCellCount } from "../helpers";

test.each([
    [{ deleteColumnIndex: 0, columnCellCount: [1, 1] }],
    [{ deleteColumnIndex: 1, columnCellCount: [1, 1] }],
    [{ deleteColumnIndex: 2, columnCellCount: [1, 1] }],
])(
    "should delete column at index ($deleteColumnIndex), decrease width by 1, and shift all cells",
    ({ deleteColumnIndex, columnCellCount }) => {
        const modifiedGrid = gridDeleteColumn(
            Square3x3GridWithCellsOnDiagonal,
            deleteColumnIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.width).toBe(
            Square3x3GridWithCellsOnDiagonal.options.width - 1
        );
        expect(
            eachColumnMatchesCellCount(modifiedGrid, columnCellCount),
            "should have matching number of cells in each column"
        ).toBe(true);
    }
);

test.each([[{ deleteColumnIndex: -1 }], [{ deleteColumnIndex: 10 }]])(
    "should return the same grid when deleting column at invalid index ($deleteColumnIndex)",
    ({ deleteColumnIndex }) => {
        const modifiedGrid = gridDeleteColumn(
            Square3x3GridWithCellsOnDiagonal,
            deleteColumnIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.width).toBe(
            Square3x3GridWithCellsOnDiagonal.options.width
        );
        expect(modifiedGrid).toBe(Square3x3GridWithCellsOnDiagonal);
    }
);

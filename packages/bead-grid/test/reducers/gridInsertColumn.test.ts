import { expect, test } from "vitest";
import { gridInsertColumnReducer } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachColumnMatchesCellCount } from "../helpers";

test.each([
    [{ insertColumnIndex: 0, columnCellCount: [0, 1, 1, 1] }],
    [{ insertColumnIndex: 1, columnCellCount: [1, 0, 1, 1] }],
    [{ insertColumnIndex: 2, columnCellCount: [1, 1, 0, 1] }],
])(
    "should insert empty column at index ($insertColumnIndex), increase width by 1, and shift all cells",
    ({ insertColumnIndex, columnCellCount }) => {
        const modifiedGrid = gridInsertColumnReducer(
            Square3x3GridWithCellsOnDiagonal,
            insertColumnIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.width).toBe(
            Square3x3GridWithCellsOnDiagonal.options.width + 1
        );
        expect(
            modifiedGrid.cells,
            "should have same number of cells as original"
        ).toHaveLength(Square3x3GridWithCellsOnDiagonal.cells.length);
        expect(
            modifiedGrid.cells.filter(
                (cell) => cell.offset.columnIndex === insertColumnIndex
            ),
            "should have new column with no cells"
        ).toHaveLength(0);
        expect(
            eachColumnMatchesCellCount(modifiedGrid, columnCellCount),
            "should have matching number of cells in each column"
        ).toBe(true);
    }
);

test.each([[{ insertColumnIndex: -1 }], [{ insertColumnIndex: 10 }]])(
    "should return the same grid as original when inserting column at invalid index ($insertColumnIndex)",
    ({ insertColumnIndex }) => {
        const modifiedGrid = gridInsertColumnReducer(
            Square3x3GridWithCellsOnDiagonal,
            insertColumnIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.width).toBe(
            Square3x3GridWithCellsOnDiagonal.options.width
        );
        expect(modifiedGrid).toBe(Square3x3GridWithCellsOnDiagonal);
    }
);

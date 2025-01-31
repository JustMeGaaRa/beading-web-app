import { expect, test } from "vitest";
import { gridInsertRow } from "../../src";
import { Square3x3GridWithCellsOnDiagonal } from "../constants";
import { eachRowMatchesCellCount } from "../helpers";

test.each([
    [{ insertRowIndex: 0, rowCellCount: [0, 1, 1, 1] }],
    [{ insertRowIndex: 1, rowCellCount: [1, 0, 1, 1] }],
    [{ insertRowIndex: 2, rowCellCount: [1, 1, 0, 1] }],
])(
    "should insert empty row at index ($insertRowIndex), increase height by 1, and shift all cells ",
    ({ insertRowIndex, rowCellCount }) => {
        const modifiedGrid = gridInsertRow(
            Square3x3GridWithCellsOnDiagonal,
            insertRowIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.height).toBe(
            Square3x3GridWithCellsOnDiagonal.options.height + 1
        );
        expect(
            modifiedGrid.cells,
            "should have same number of cells as original"
        ).toHaveLength(Square3x3GridWithCellsOnDiagonal.cells.length);
        expect(
            modifiedGrid.cells.filter(
                (cell) => cell.offset.rowIndex === insertRowIndex
            ),
            "should have new row with no cells"
        ).toHaveLength(0);
        expect(
            eachRowMatchesCellCount(modifiedGrid, rowCellCount),
            "should have matching number of cells in each row"
        ).toBe(true);
    }
);

test.each([[{ insertRowIndex: -1 }], [{ insertRowIndex: 10 }]])(
    "should return the same grid as original when inserting row at invalid index ($insertRowIndex)",
    ({ insertRowIndex }) => {
        const modifiedGrid = gridInsertRow(
            Square3x3GridWithCellsOnDiagonal,
            insertRowIndex
        );

        expect(modifiedGrid).toBeDefined();
        expect(modifiedGrid.options).toBeDefined();
        expect(modifiedGrid.options.height).toBe(
            Square3x3GridWithCellsOnDiagonal.options.height
        );
        expect(modifiedGrid).toBe(Square3x3GridWithCellsOnDiagonal);
    }
);

import { BeadingGridState } from "../src";

export function eachRowMatchesCellCount(
    grid: BeadingGridState,
    rowCellCount: number[]
) {
    return Array.from({ length: grid.options.height }).every((_, rowIndex) => {
        const cellsInRow = grid.cells.filter(
            (cell) => cell.offset.rowIndex === rowIndex
        );
        const expectedCellCount = rowCellCount[rowIndex];
        return cellsInRow.length === expectedCellCount;
    });
}

export function eachColumnMatchesCellCount(
    grid: BeadingGridState,
    columnCellCount: number[]
) {
    return Array.from({ length: grid.options.width }).every(
        (_, columnIndex) => {
            const cellsInColumn = grid.cells.filter(
                (cell) => cell.offset.columnIndex === columnIndex
            );
            const expectedCellCount = columnCellCount[columnIndex];
            return cellsInColumn.length === expectedCellCount;
        }
    );
}

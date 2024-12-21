import { BeadingGridState, BeadingGridCellState } from "../types";

export const gridSetCell = (
    grid: BeadingGridState,
    targetCell: BeadingGridCellState
): BeadingGridState => {
    // check if the grid already contains the cell with the same color and offset
    if (
        grid.cells.some(
            (current) =>
                current.offset.rowIndex === targetCell.offset.rowIndex &&
                current.offset.columnIndex === targetCell.offset.columnIndex &&
                current.color === targetCell.color
        )
    ) {
        return grid;
    }

    // check if the target cell is out of bounds or has no color
    if (
        targetCell.offset.rowIndex < 0 ||
        targetCell.offset.columnIndex < 0 ||
        targetCell.offset.rowIndex >= grid.options.height ||
        targetCell.offset.columnIndex >= grid.options.width ||
        targetCell.color === ""
    ) {
        return grid;
    }

    return {
        ...grid,
        cells: [
            // filter out the cell with the same offset if it exists
            ...grid.cells.filter(
                (cell) =>
                    cell.offset.columnIndex !== targetCell.offset.columnIndex &&
                    cell.offset.rowIndex !== targetCell.offset.rowIndex
            ),
            targetCell,
        ],
    };
};

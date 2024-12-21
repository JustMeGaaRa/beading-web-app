import { BeadingGridState, BeadingGridCellState } from "../types";
import { isInBounds } from "../utils";

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
        !isInBounds(grid.options, targetCell.offset) ||
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
                    cell.offset.columnIndex !== targetCell.offset.columnIndex ||
                    cell.offset.rowIndex !== targetCell.offset.rowIndex
            ),
            targetCell,
        ],
    };
};

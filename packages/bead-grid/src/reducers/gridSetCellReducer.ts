import {
    BeadingGridState,
    BeadingGridCellState,
    shallowEqualsCell,
    deepEqualsCell,
} from "../types";
import { getGridBounds, indeciesInBounds, isNullOrEmpty } from "../utils";

export const gridSetCell = (
    grid: BeadingGridState,
    modifiedCell: BeadingGridCellState
): BeadingGridState => {
    const deepEqualsTargetCell = (current: BeadingGridCellState) =>
        deepEqualsCell(current, modifiedCell);

    // check if the grid already contains the cell with the same color and offset
    if (grid.cells.some(deepEqualsTargetCell)) {
        return grid;
    }

    // check if the target cell is out of bounds or has no color
    const area = getGridBounds(grid.options);
    if (!indeciesInBounds(area, modifiedCell.offset)) {
        return grid;
    }

    // check if the target cell is blank and remove it from the grid
    if (isNullOrEmpty(modifiedCell.color)) {
        return {
            ...grid,
            cells: grid.cells.filter(
                (cell) => !shallowEqualsCell(cell, modifiedCell)
            ),
        };
    }

    return {
        ...grid,
        cells: [
            // filter out the cell with the same offset if it exists
            ...grid.cells.filter(
                (cell) => !shallowEqualsCell(cell, modifiedCell)
            ),
            modifiedCell,
        ],
    };
};

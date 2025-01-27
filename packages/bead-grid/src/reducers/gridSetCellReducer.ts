import {
    BeadingGrid,
    BeadingGridCell,
    shallowEqualsCell,
    deepEqualsCell,
    createGridBounds,
} from "../types";
import { indeciesInBounds, isNullOrEmpty } from "../utils";

export const gridSetCell = (
    grid: BeadingGrid,
    modifiedCell: BeadingGridCell
): BeadingGrid => {
    const deepEqualsTargetCell = (current: BeadingGridCell) =>
        deepEqualsCell(current, modifiedCell);

    // check if the grid already contains the cell with the same color and offset
    if (grid.cells.some(deepEqualsTargetCell)) {
        return grid;
    }

    // check if the target cell is out of bounds or has no color
    const area = createGridBounds(grid.options, grid.offset);
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

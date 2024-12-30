import { BeadingGridState, BeadingGridCellState } from "../types";
import { isInBounds, isNullOrEmpty } from "../utils";

const deepEqualsCell = (
    left: BeadingGridCellState,
    right: BeadingGridCellState
) => {
    return (
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex &&
        left.color === right.color &&
        left.isSelected === right.isSelected
    );
};

const shallowEqualsCell = (
    left: BeadingGridCellState,
    right: BeadingGridCellState
) => {
    return (
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex
    );
};

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
    if (!isInBounds(grid.options, modifiedCell.offset)) {
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

export const gridSetCells = (
    grid: BeadingGridState,
    modifiedCells: Array<BeadingGridCellState>
): BeadingGridState => {
    return modifiedCells.reduce(gridSetCell, grid);
};

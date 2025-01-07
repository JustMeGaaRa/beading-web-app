import { BeadingGridOffset } from "./BeadingGridBounds";

export type BeadingGridCellState = {
    color: string;
    offset: BeadingGridOffset;
};

export const deepEqualsCell = (
    left: BeadingGridCellState,
    right: BeadingGridCellState
) => {
    return (
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex &&
        left.color === right.color
    );
};

export const shallowEqualsCell = (
    left: BeadingGridCellState,
    right: BeadingGridCellState
) => {
    return (
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex
    );
};

export const shiftCell = (
    cell: BeadingGridCellState,
    offset: BeadingGridOffset
) => {
    return {
        ...cell,
        offset: {
            columnIndex: cell.offset.columnIndex + offset.columnIndex,
            rowIndex: cell.offset.rowIndex + offset.rowIndex,
        },
    };
};

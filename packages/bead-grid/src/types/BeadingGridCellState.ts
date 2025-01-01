import { BeadingGridOffset } from "./BeadingGridBounds";

export type BeadingGridCellState = {
    color: string;
    offset: BeadingGridOffset;
    // TODO: replace isSelected with array of selected indices in the provider to avoid saving this state
    isSelected?: boolean;
};

export const deepEqualsCell = (
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

export const shallowEqualsCell = (
    left: BeadingGridCellState,
    right: BeadingGridCellState
) => {
    return (
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex
    );
};

export const shift = (
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

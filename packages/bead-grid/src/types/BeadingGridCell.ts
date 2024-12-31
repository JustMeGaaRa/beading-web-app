import { BeadingGridOffset } from "./BeadingGridOffset";

export type BeadingGridCellState = {
    color: string;
    offset: BeadingGridOffset;
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

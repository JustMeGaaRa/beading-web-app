import { BeadingGridOffset, shiftOffset } from "./BeadingGridOffset";

export type BeadingGridCell = {
    color: string;
    offset: BeadingGridOffset;
};

export const getCellKey = (cell: BeadingGridCell) => {
    return `${cell.offset.rowIndex}-${cell.offset.columnIndex}`;
};

export const shiftCell = (cell: BeadingGridCell, offset: BeadingGridOffset) => {
    return {
        ...cell,
        offset: shiftOffset(cell.offset, offset),
    };
};

export const deepEqualsCell = (
    left: BeadingGridCell,
    right: BeadingGridCell
) => {
    return (
        left !== undefined &&
        right !== undefined &&
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex &&
        left.color === right.color
    );
};

export const shallowEqualsCell = (
    left: BeadingGridCell,
    right: BeadingGridCell
) => {
    return (
        left !== undefined &&
        right !== undefined &&
        left.offset.columnIndex === right.offset.columnIndex &&
        left.offset.rowIndex === right.offset.rowIndex
    );
};

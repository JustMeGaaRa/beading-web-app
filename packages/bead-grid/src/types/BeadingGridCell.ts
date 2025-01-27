import {
    BeadingGridOffset,
    negateOffset,
    shiftOffset,
} from "./BeadingGridBounds";
import { RenderPoint } from "./RenderBounds";

export type BeadingGridCell = {
    color: string;
    offset: BeadingGridOffset;
};

export type BeadingGridCellMetadata = {
    position: RenderPoint;
    height: number;
    width: number;
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

export const getRelativeCell = (
    cell: BeadingGridCell,
    offset: BeadingGridOffset
): BeadingGridCell => {
    return {
        ...cell,
        offset: shiftOffset(cell.offset, negateOffset(offset)),
    };
};

export const getCellAbsoluteIndicies = (
    cell: BeadingGridCell,
    offset: BeadingGridOffset
): BeadingGridCell => {
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

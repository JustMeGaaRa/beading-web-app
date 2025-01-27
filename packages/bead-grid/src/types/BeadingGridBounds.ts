import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridOffset = {
    columnIndex: number;
    rowIndex: number;
};

export type BeadingGridSize = {
    height: number;
    width: number;
};

export type BeadingGridBounds = {
    offset: BeadingGridOffset;
} & BeadingGridSize;

export const getGridSize = (
    options: BeadingGridProperties
): BeadingGridSize => {
    return {
        height: getGridHeight(options),
        width: options.width,
    };
};

export const getGridHeight = (options: BeadingGridProperties) => {
    return options.type === "brick"
        ? options.height + options.fringe
        : options.height;
};

export const createGridBounds = (
    options: BeadingGridProperties,
    offset: BeadingGridOffset
): BeadingGridBounds => {
    return {
        offset,
        ...getGridSize(options),
    };
};

export const shiftOffset = (
    offset: BeadingGridOffset,
    shift: BeadingGridOffset
): BeadingGridOffset => {
    return {
        columnIndex: offset.columnIndex + shift.columnIndex,
        rowIndex: offset.rowIndex + shift.rowIndex,
    };
};

export const negateOffset = (offset: BeadingGridOffset): BeadingGridOffset => {
    return {
        columnIndex: -offset.columnIndex,
        rowIndex: -offset.rowIndex,
    };
};

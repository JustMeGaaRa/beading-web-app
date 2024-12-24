import { BeadingGridOffset, BeadingGridState, BeadProperties } from "../types";

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const flipBead = (bead: BeadProperties): BeadProperties => {
    return {
        ...bead,
        width: bead.height,
        height: bead.width,
    };
};

// TODO: replace with isInBounds in the grid.ts file
export const isPositionInBounds = (
    grid: BeadingGridState,
    offset: BeadingGridOffset,
    columnIndex: number,
    rowIndex: number
) => {
    return (
        offset.rowIndex + rowIndex >= 0 &&
        offset.rowIndex + rowIndex < grid.options.height &&
        offset.columnIndex + columnIndex >= 0 &&
        offset.columnIndex + columnIndex < grid.options.width
    );
};

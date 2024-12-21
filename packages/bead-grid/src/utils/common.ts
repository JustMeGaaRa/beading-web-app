import {
    BeadingGridOffset,
    BeadingGridStateLegacy,
    BeadProperties,
} from "../types";

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

export const isPositionInBounds = (
    grid: BeadingGridStateLegacy,
    offset: BeadingGridOffset,
    columnIndex: number,
    rowIndex: number
) => {
    return (
        offset.rowIndex + rowIndex >= 0 &&
        offset.rowIndex + rowIndex < grid.rows.length &&
        offset.columnIndex + columnIndex >= 0 &&
        offset.columnIndex + columnIndex < (grid.rows[0]?.cells.length ?? 0)
    );
};

import { BeadingGridCell, BeadingGridOffset, BeadingGrid } from "../types";

export const isBeadingGrid = (data: unknown): data is BeadingGrid => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        "gridId" in data &&
        "name" in data &&
        "options" in data &&
        "cells" in data &&
        typeof data.gridId === "string" &&
        typeof data.name === "string" &&
        typeof data.options === "object" &&
        typeof data.cells === "object" &&
        Array.isArray(data.cells) &&
        data.cells.every((cell: unknown) => isBeadingGridCell(cell))
    );
};

export const isBeadingGridCell = (data: unknown): data is BeadingGridCell => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        "color" in data &&
        "offset" in data &&
        typeof data.color === "string" &&
        typeof data.offset === "object" &&
        isBeadingOffset(data.offset)
    );
};

export const isBeadingOffset = (data: unknown): data is BeadingGridOffset => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        "columnIndex" in data &&
        "rowIndex" in data &&
        typeof data.columnIndex === "number" &&
        typeof data.rowIndex === "number"
    );
};

import { BeadingGridOffset } from "./BeadingGridOffset";
import { BeadingGridProperties } from "./BeadingGridProperties";
import { BeadingGridSize, getGridSize } from "./BeadingGridSize";

export type BeadingGridBounds = {
    offset: BeadingGridOffset;
} & BeadingGridSize;

export const createGridBounds = (
    options: BeadingGridProperties,
    offset: BeadingGridOffset
): BeadingGridBounds => {
    return {
        offset,
        ...getGridSize(options),
    };
};

export const indeciesInBounds = (
    bounds: BeadingGridBounds,
    offset: BeadingGridOffset
) => {
    return (
        offset.columnIndex >= 0 &&
        offset.columnIndex < bounds.offset.columnIndex + bounds.width &&
        offset.rowIndex >= 0 &&
        offset.rowIndex < bounds.offset.rowIndex + bounds.height
    );
};

import {
    BeadingGridOffset,
    BeadingGridState,
    BeadingGridStyles,
} from "../types";
import { getGridCellRenderSize } from "./rendering";

export const hitTest = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    cursor: { x: number; y: number }
) => {
    // TODO: acount for different types of grids and staggered grids
    const beadSize = getGridCellRenderSize(grid.options, styles);
    const gridBoundaries = {
        topLeft: {
            columnIndex: 0,
            rowIndex: 0,
        },
        bottomRight: {
            columnIndex: grid.options.width,
            rowIndex: grid.options.height,
        },
    };
    const hitResult: BeadingGridOffset = {
        columnIndex: Math.floor(cursor.x / beadSize.width),
        rowIndex: Math.floor(cursor.y / beadSize.height),
    };

    return {
        successfull:
            hitResult.columnIndex >= gridBoundaries.topLeft.columnIndex &&
            hitResult.columnIndex < gridBoundaries.bottomRight.columnIndex &&
            hitResult.rowIndex >= gridBoundaries.topLeft.rowIndex &&
            hitResult.rowIndex < gridBoundaries.bottomRight.rowIndex,
        hitResult: hitResult,
    };
};

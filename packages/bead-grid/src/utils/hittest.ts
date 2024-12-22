import {
    BeadingGridOffset,
    BeadingGridState,
    BeadingGridStyles,
} from "../types";
import { getGridCellOffset, getGridCellSize } from "./rendering";

const getNeighbourCells = (offset: BeadingGridOffset) => {
    return [
        { columnIndex: offset.columnIndex - 1, rowIndex: offset.rowIndex - 1 },
        { columnIndex: offset.columnIndex - 1, rowIndex: offset.rowIndex },
        { columnIndex: offset.columnIndex - 1, rowIndex: offset.rowIndex + 1 },
        { columnIndex: offset.columnIndex, rowIndex: offset.rowIndex - 1 },
        { columnIndex: offset.columnIndex, rowIndex: offset.rowIndex },
        { columnIndex: offset.columnIndex, rowIndex: offset.rowIndex + 1 },
        { columnIndex: offset.columnIndex + 1, rowIndex: offset.rowIndex - 1 },
        { columnIndex: offset.columnIndex + 1, rowIndex: offset.rowIndex },
        { columnIndex: offset.columnIndex + 1, rowIndex: offset.rowIndex + 1 },
    ];
};

export const hitTest = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    cursor: { x: number; y: number }
) => {
    const beadSize = getGridCellSize(grid.options, styles);
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
    const hitResultApproximation: BeadingGridOffset = {
        columnIndex: Math.floor(cursor.x / beadSize.width),
        rowIndex: Math.floor(cursor.y / beadSize.height),
    };
    const hitResult =
        grid.options.type === "square"
            ? hitResultApproximation
            : getNeighbourCells(hitResultApproximation).find((cell) => {
                  const offset = getGridCellOffset(cell, grid.options, styles);
                  const isInBounds =
                      cursor.x >= offset.x &&
                      cursor.x < offset.x + beadSize.width &&
                      cursor.y >= offset.y &&
                      cursor.y < offset.y + beadSize.height;
                  return isInBounds;
              })!;

    return {
        successfull:
            hitResult.columnIndex >= gridBoundaries.topLeft.columnIndex &&
            hitResult.columnIndex < gridBoundaries.bottomRight.columnIndex &&
            hitResult.rowIndex >= gridBoundaries.topLeft.rowIndex &&
            hitResult.rowIndex < gridBoundaries.bottomRight.rowIndex,
        hitResult: hitResult,
    };
};

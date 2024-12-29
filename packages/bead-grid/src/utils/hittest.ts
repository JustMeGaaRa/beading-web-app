import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridSelectedArea,
    BeadingGridState,
    BeadingGridStyles,
} from "../types";
import { getGridCellOffset, getGridCellRenderSize } from "./rendering";

export type HitTestResult = {
    successfull: boolean;
    hitResult: Array<BeadingGridCellState>;
};

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

export const hitTestCursor = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    cursor: { x: number; y: number }
): HitTestResult => {
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
    const hitResultApproximation: BeadingGridOffset = {
        columnIndex: Math.floor(cursor.x / beadSize.width),
        rowIndex: Math.floor(cursor.y / beadSize.height),
    };
    const hitCells: Array<BeadingGridCellState> =
        grid.options.type === "square"
            ? [{ offset: hitResultApproximation, color: "" }]
            : getNeighbourCells(hitResultApproximation)
                  .filter((cell) => {
                      const offset = getGridCellOffset(
                          cell,
                          grid.options,
                          styles
                      );
                      const isInBounds =
                          cursor.x >= offset.x &&
                          cursor.x < offset.x + beadSize.width &&
                          cursor.y >= offset.y &&
                          cursor.y < offset.y + beadSize.height;
                      return isInBounds;
                  })
                  .map((offset) => ({
                      offset: offset,
                      color: "",
                  }))!;

    return {
        successfull: hitCells.every(
            (hitResult) =>
                hitResult.offset.columnIndex >=
                    gridBoundaries.topLeft.columnIndex &&
                hitResult.offset.columnIndex <
                    gridBoundaries.bottomRight.columnIndex &&
                hitResult.offset.rowIndex >= gridBoundaries.topLeft.rowIndex &&
                hitResult.offset.rowIndex < gridBoundaries.bottomRight.rowIndex
        ),
        hitResult: hitCells,
    };
};

export const hitTestArea = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    selection: BeadingGridSelectedArea
): HitTestResult => {
    const hitCells = grid.cells.filter((cell) => {
        const boundary = getGridCellOffset(cell.offset, grid.options, styles);
        return (
            boundary.x >= selection.x &&
            boundary.x + boundary.width <= selection.x + selection.width &&
            boundary.y >= selection.y &&
            boundary.y + boundary.height <= selection.y + selection.height
        );
    });
    return {
        successfull: hitCells.length > 0,
        hitResult: hitCells,
    };
};

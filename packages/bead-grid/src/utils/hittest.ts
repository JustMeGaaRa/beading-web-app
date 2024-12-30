import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridBoundary,
    BeadingGridState,
    BeadingGridStyles,
} from "../types";
import { getGridCellBoundary, getGridCellRenderSize } from "./rendering";

export type HitTestResult = {
    successfull: boolean;
    hits: Array<BeadingGridCellState>;
};

const isInBounds = (
    area: { x: number; y: number; width: number; height: number },
    point: { x: number; y: number }
) => {
    return (
        point.x >= area.x &&
        point.x <= area.x + area.width &&
        point.y >= area.y &&
        point.y <= area.y + area.height
    );
};

const indeciesInBounds = (
    area: { height: number; width: number },
    offset: BeadingGridOffset
) => {
    return (
        offset.columnIndex >= 0 &&
        offset.columnIndex < area.width &&
        offset.rowIndex >= 0 &&
        offset.rowIndex < area.height
    );
};

const getNeighbourCells = (offset: BeadingGridOffset) => {
    return [
        {
            offset: {
                columnIndex: offset.columnIndex - 1,
                rowIndex: offset.rowIndex - 1,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex - 1,
                rowIndex: offset.rowIndex,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex - 1,
                rowIndex: offset.rowIndex + 1,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex,
                rowIndex: offset.rowIndex - 1,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex,
                rowIndex: offset.rowIndex,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex,
                rowIndex: offset.rowIndex + 1,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex + 1,
                rowIndex: offset.rowIndex - 1,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex + 1,
                rowIndex: offset.rowIndex,
            },
            color: "",
        },
        {
            offset: {
                columnIndex: offset.columnIndex + 1,
                rowIndex: offset.rowIndex + 1,
            },
            color: "",
        },
    ];
};

export const hitTestCursor = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    cursor: { x: number; y: number }
): HitTestResult => {
    const beadSize = getGridCellRenderSize(grid.options, styles);
    const hitCellApproximation: BeadingGridOffset = {
        columnIndex: Math.floor(cursor.x / beadSize.width),
        rowIndex: Math.floor(cursor.y / beadSize.height),
    };
    const hitCells: Array<BeadingGridCellState> =
        grid.options.type === "square"
            ? [{ offset: hitCellApproximation, color: "" }]
            : getNeighbourCells(hitCellApproximation).filter((cell) =>
                  isInBounds(
                      getGridCellBoundary(cell.offset, grid.options, styles),
                      cursor
                  )
              )!;

    // TODO: consider filtering out the cells that are out of bounds
    return {
        successfull: hitCells.every((cell) =>
            indeciesInBounds(grid.options, cell.offset)
        ),
        hits: hitCells,
    };
};

export const hitTestArea = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    area: BeadingGridBoundary
): HitTestResult => {
    const hitCells = grid.cells.filter((cell) => {
        const boundary = getGridCellBoundary(cell.offset, grid.options, styles);
        const boundaryTopLeft = { x: boundary.x, y: boundary.y };
        const boundaryBottomRight = {
            x: boundary.x + boundary.width,
            y: boundary.y + boundary.height,
        };
        return (
            isInBounds(area, boundaryTopLeft) &&
            isInBounds(area, boundaryBottomRight)
        );
    });
    return {
        successfull: hitCells.length > 0,
        hits: hitCells,
    };
};

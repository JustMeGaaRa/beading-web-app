import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridState,
    BeadingGridStyles,
    BeadingGridSectionBounds,
    RenderBounds,
    RenderPoint,
    shallowEqualsCell,
    shiftOffset,
} from "../types";
import { getGridBounds } from "./grid";
import { getGridCellRenderBounds, getGridCellRenderSize } from "./rendering";

export type HitTestResult = {
    successfull: boolean;
    hits: Array<BeadingGridCellState>;
};

export const pointInBounds = (area: RenderBounds, point: RenderPoint) => {
    return (
        point.x >= area.relativePosition.x &&
        point.x < area.relativePosition.x + area.width &&
        point.y >= area.relativePosition.y &&
        point.y < area.relativePosition.y + area.height
    );
};

export const indeciesInBounds = (
    area: BeadingGridSectionBounds,
    offset: BeadingGridOffset
) => {
    return (
        offset.columnIndex >= area.topLeft.columnIndex &&
        offset.columnIndex < area.topLeft.columnIndex + area.width &&
        offset.rowIndex >= area.topLeft.rowIndex &&
        offset.rowIndex < area.topLeft.rowIndex + area.height
    );
};

const getNeighbourCells = (
    offset: BeadingGridOffset
): Array<BeadingGridCellState> => {
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
    cursor: RenderPoint
): HitTestResult => {
    const beadSize = getGridCellRenderSize(grid.options, styles);
    const hitCellApproximation: BeadingGridCellState = {
        offset: {
            columnIndex:
                Math.floor(cursor.x / beadSize.width) - grid.offset.columnIndex,
            rowIndex:
                Math.floor(cursor.y / beadSize.height) - grid.offset.rowIndex,
        },
        color: "",
    };
    const hitCells: Array<BeadingGridCellState> =
        grid.options.type === "square"
            ? [hitCellApproximation]
            : getNeighbourCells(hitCellApproximation.offset).filter((cell) => {
                  const cellAbsoluteOffset = shiftOffset(
                      cell.offset,
                      grid.offset
                  );
                  const bounds = getGridCellRenderBounds(
                      cellAbsoluteOffset,
                      grid.options,
                      styles
                  );
                  return pointInBounds(bounds, cursor);
              })!;

    const equalCellApproximation = (cell: BeadingGridCellState) => {
        return shallowEqualsCell(cell, hitCellApproximation);
    };
    // TODO: consider filtering out the cells that are out of bounds
    return {
        successfull: hitCells.every((cell) => {
            const bounds = getGridBounds(grid.options);
            return indeciesInBounds(bounds, cell.offset);
        }),
        hits: hitCells.map(
            (cell) => grid.cells.find(equalCellApproximation) ?? cell
        ),
    };
};

export const hitTestArea = (
    grid: BeadingGridState,
    styles: BeadingGridStyles,
    area: RenderBounds
): HitTestResult => {
    const hitCells = grid.cells.filter((cell) => {
        const cellAbsoluteOffset = shiftOffset(cell.offset, grid.offset);
        const boundary = getGridCellRenderBounds(
            cellAbsoluteOffset,
            grid.options,
            styles
        );
        const boundaryTopLeft = {
            x: boundary.relativePosition.x,
            y: boundary.relativePosition.y,
        };
        const boundaryBottomRight = {
            x: boundary.relativePosition.x + boundary.width - 1,
            y: boundary.relativePosition.y + boundary.height - 1,
        };
        return (
            pointInBounds(area, boundaryTopLeft) &&
            pointInBounds(area, boundaryBottomRight)
        );
    });
    return {
        successfull: hitCells.length > 0,
        hits: hitCells,
    };
};

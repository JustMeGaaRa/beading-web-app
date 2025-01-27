import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGrid,
    BeadingGridStyles,
    BeadingGridBounds,
    RenderBounds,
    RenderPoint,
    shallowEqualsCell,
    shiftOffset,
    createGridBounds,
} from "../types";
import {
    getGridCellRenderBounds,
    getGridCellRenderSize,
    getGridRenderBounds,
} from "./rendering";

export type HitTestResult = {
    successfull: boolean;
    hits: Array<BeadingGridCell>;
};

export const pointInBounds = (bounds: RenderBounds, point: RenderPoint) => {
    return (
        point.x >= bounds.position.x &&
        point.x < bounds.position.x + bounds.width &&
        point.y >= bounds.position.y &&
        point.y < bounds.position.y + bounds.height
    );
};

export const cellInBounds = (bounds: RenderBounds, cell: RenderBounds) => {
    const bottomRight = {
        x: cell.position.x + cell.width,
        y: cell.position.y + cell.height,
    };
    return (
        pointInBounds(bounds, cell.position) &&
        pointInBounds(bounds, bottomRight)
    );
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

const getNeighbourCells = (
    offset: BeadingGridOffset
): Array<BeadingGridCell> => {
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

export const getCellAtPosition = (
    grid: BeadingGrid,
    styles: BeadingGridStyles,
    position: RenderPoint
): HitTestResult => {
    const gridRenderBounds = getGridRenderBounds(
        grid.offset,
        grid.options,
        styles
    );
    const isCursorInBounds = pointInBounds(gridRenderBounds, position);

    if (!isCursorInBounds) {
        return {
            successfull: false,
            hits: [],
        };
    }

    const beadSize = getGridCellRenderSize(grid.options, styles);
    const hitCellApproximation: BeadingGridCell = {
        offset: {
            columnIndex:
                Math.floor(position.x / beadSize.width) -
                grid.offset.columnIndex,
            rowIndex:
                Math.floor(position.y / beadSize.height) - grid.offset.rowIndex,
        },
        color: "",
    };

    const gridBounds = createGridBounds(grid.options, grid.offset);
    const hitCells: Array<BeadingGridCell> =
        grid.options.type === "square"
            ? [hitCellApproximation]
            : getNeighbourCells(hitCellApproximation.offset)
                  .filter((cell) => indeciesInBounds(gridBounds, cell.offset))
                  .filter((cell) => {
                      const cellAbsoluteOffset = shiftOffset(
                          cell.offset,
                          grid.offset
                      );
                      const bounds = getGridCellRenderBounds(
                          cellAbsoluteOffset,
                          grid.options,
                          styles
                      );
                      return pointInBounds(bounds, position);
                  })
                  .map(
                      (cell) =>
                          grid.cells.find((existing: BeadingGridCell) => {
                              return shallowEqualsCell(
                                  existing,
                                  hitCellApproximation
                              );
                          }) ?? cell
                  );
    return {
        successfull: hitCells.length > 0,
        hits: hitCells,
    };
};

export const getCellsInBounds = (
    grid: BeadingGrid,
    styles: BeadingGridStyles,
    bounds: RenderBounds
): HitTestResult => {
    const hitCells = grid.cells.filter((cell) => {
        const cellAbsoluteOffset = shiftOffset(cell.offset, grid.offset);
        const boundary = getGridCellRenderBounds(
            cellAbsoluteOffset,
            grid.options,
            styles
        );
        const boundaryTopLeft = {
            x: boundary.position.x,
            y: boundary.position.y,
        };
        const boundaryBottomRight = {
            x: boundary.position.x + boundary.width - 1,
            y: boundary.position.y + boundary.height - 1,
        };
        return (
            pointInBounds(bounds, boundaryTopLeft) &&
            pointInBounds(bounds, boundaryBottomRight)
        );
    });
    return {
        successfull: hitCells.length > 0,
        hits: hitCells,
    };
};

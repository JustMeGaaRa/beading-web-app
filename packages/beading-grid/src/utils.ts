import { CELL_BLANK_COLOR, CELL_PIXEL_RATIO } from "./constants";
import {
    BeadingGridCell,
    BeadingGridState,
    BeadSize,
    BeadingGridOffset,
    BeadingGridSection,
    BeadingGridRectangle,
    BeadingGridWindow,
} from "./types";

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

export const insertGridRow = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: [
            ...state.rows.slice(0, rowIndex),
            {
                cells: Array.from(
                    { length: state.options.width },
                    () => CELL_BLANK_COLOR
                ),
            },
            ...state.rows.slice(rowIndex),
        ],
        options: {
            ...state.options,
            height: state.options.height + 1,
        },
    };
};

export const clearGridRow = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row, index) =>
            index === rowIndex
                ? { cells: row.cells.map(() => CELL_BLANK_COLOR) }
                : row
        ),
        options: {
            ...state.options,
            height: state.options.height - 1,
        },
    };
};

export const deleteGridRow = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.filter((_, index) => index !== rowIndex),
        options: {
            ...state.options,
            height: state.options.height - 1,
        },
    };
};

export const insertGridColumn = (
    state: BeadingGridState,
    columnIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: [
                ...row.cells.slice(0, columnIndex),
                CELL_BLANK_COLOR,
                ...row.cells.slice(columnIndex),
            ],
        })),
        options: {
            ...state.options,
            width: state.options.width + 1,
        },
    };
};

export const clearGridColumn = (
    state: BeadingGridState,
    columnIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: row.cells.map((cell, index) =>
                index === columnIndex ? CELL_BLANK_COLOR : cell
            ),
        })),
        options: {
            ...state.options,
            width: state.options.width - 1,
        },
    };
};

export const deleteGridColumn = (
    state: BeadingGridState,
    columnIndex: number
): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: row.cells.filter((_, index) => index !== columnIndex),
        })),
        options: {
            ...state.options,
            width: state.options.width - 1,
        },
    };
};

export const isPositionInBounds = (
    grid: BeadingGridState,
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

export const setGridCell = (
    grid: BeadingGridState,
    cell: BeadingGridCell
): BeadingGridState => {
    const { columnIndex, rowIndex } = cell.offset;

    // Check if the cell already has the desired color
    if (grid.rows[rowIndex]?.cells[columnIndex] === cell.color) {
        return grid;
    }

    // Create a new row with the updated cell
    const modifiedRow = {
        ...grid.rows[rowIndex],
        cells:
            grid.rows[rowIndex]?.cells.map((gridCell, gridColumnIndex) =>
                gridColumnIndex === columnIndex ? cell.color : gridCell
            ) ?? [],
    };

    return {
        ...grid,
        rows: grid.rows.map((gridRow, gridRowIndex) =>
            gridRowIndex === rowIndex ? modifiedRow : gridRow
        ),
    };
};

export const getGridWindow = (
    startCell: BeadingGridOffset,
    endCell: BeadingGridOffset
) => {
    const topLeftRowIndex = Math.min(startCell.rowIndex, endCell.rowIndex);
    const topLeftColumnIndex = Math.min(
        startCell.columnIndex,
        endCell.columnIndex
    );
    const bottomRightRowIndex = Math.max(startCell.rowIndex, endCell.rowIndex);
    const bottomRightColumnIndex = Math.max(
        startCell.columnIndex,
        endCell.columnIndex
    );

    return {
        offset: { rowIndex: topLeftRowIndex, columnIndex: topLeftColumnIndex },
        height: bottomRightRowIndex - topLeftRowIndex + 1,
        width: bottomRightColumnIndex - topLeftColumnIndex + 1,
    };
};

export const getGridWindowProjection = (
    grid: BeadingGridState,
    centerSection: BeadingGridWindow,
    projection: "horizontal" | "vertical"
): Array<BeadingGridWindow> => {
    const gridHeight = grid.rows.length - 1;
    const gridWidth = (grid.rows[0]?.cells.length ?? 0) - 1;
    const mirrors: BeadingGridWindow[] = [];

    const { columnIndex, rowIndex } = centerSection.offset;
    const { width, height } = centerSection;

    const rightEdge = columnIndex + width;
    const bottomEdge = rowIndex + height;

    if (projection === "horizontal") {
        // left window
        if (columnIndex > 0) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: columnIndex - width, rowIndex },
                    { columnIndex: columnIndex - 1, rowIndex: bottomEdge - 1 }
                )
            );
        }

        // right window
        if (rightEdge < gridWidth) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: rightEdge, rowIndex },
                    {
                        columnIndex: rightEdge + width - 1,
                        rowIndex: bottomEdge - 1,
                    }
                )
            );
        }
    }

    if (projection === "vertical") {
        // top window
        if (rowIndex > 0) {
            mirrors.push(
                getGridWindow(
                    { columnIndex, rowIndex: rowIndex - height },
                    { columnIndex: rightEdge - 1, rowIndex: rowIndex - 1 }
                )
            );
        }

        // bottom window
        if (bottomEdge < gridHeight) {
            mirrors.push(
                getGridWindow(
                    { columnIndex, rowIndex: bottomEdge },
                    {
                        columnIndex: rightEdge - 1,
                        rowIndex: bottomEdge + height - 1,
                    }
                )
            );
        }
    }

    return mirrors;
};

export const getSection = (
    grid: BeadingGridState,
    window: BeadingGridWindow
): BeadingGridSection => {
    const { offset, height, width } = window;

    return {
        ...window,
        rows: grid.rows
            .slice(offset.rowIndex, offset.rowIndex + height)
            .map((row) => ({
                cells: row.cells.slice(
                    offset.columnIndex,
                    offset.columnIndex + width
                ),
            })),
    };
};

export const flipSection = (
    section: BeadingGridSection,
    direction: "horizontal" | "vertical"
): BeadingGridSection => {
    const clonedRows = section.rows.map((row) => ({ cells: [...row.cells] }));

    if (direction === "vertical") {
        for (let rowIndex = 0; rowIndex < section.height / 2; rowIndex++) {
            const oppositeRowIndex = section.height - rowIndex - 1;
            if (clonedRows[rowIndex] && clonedRows[oppositeRowIndex]) {
                [clonedRows[rowIndex], clonedRows[oppositeRowIndex]] = [
                    clonedRows[oppositeRowIndex],
                    clonedRows[rowIndex],
                ];
            }
        }
    }

    if (direction === "horizontal") {
        for (let rowIndex = 0; rowIndex < section.height; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < section.width / 2;
                columnIndex++
            ) {
                const oppositeColumnIndex = section.width - columnIndex - 1;
                [
                    clonedRows[rowIndex].cells[columnIndex],
                    clonedRows[rowIndex].cells[oppositeColumnIndex],
                ] = [
                    clonedRows[rowIndex].cells[oppositeColumnIndex],
                    clonedRows[rowIndex].cells[columnIndex],
                ];
            }
        }
    }

    return {
        ...section,
        rows: clonedRows,
    };
};

export const mergeSection = (
    grid: BeadingGridState,
    targetWindow: BeadingGridWindow,
    sourceSection: BeadingGridSection
) => {
    const clonedRows = grid.rows.map((row) => ({ cells: [...row.cells] }));

    sourceSection.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, columnIndex) => {
            if (
                isPositionInBounds(
                    grid,
                    targetWindow.offset,
                    columnIndex,
                    rowIndex
                ) &&
                cell !== CELL_BLANK_COLOR
            ) {
                const targetRowIndex = targetWindow.offset.rowIndex + rowIndex;
                const targetColumnIndex =
                    targetWindow.offset.columnIndex + columnIndex;
                if (clonedRows[targetRowIndex]) {
                    clonedRows[targetRowIndex].cells[targetColumnIndex] = cell;
                }
            }
        });
    });

    return {
        ...grid,
        rows: clonedRows,
    };
};

export const mirrorSection = (
    grid: BeadingGridState,
    targetWindow: BeadingGridWindow,
    sourceWindow: BeadingGridWindow,
    direction: "horizontal" | "vertical"
) => {
    const sourceSection = getSection(grid, sourceWindow);
    const flippedSection = flipSection(sourceSection, direction);
    const modifiedGrid = mergeSection(grid, targetWindow, flippedSection);
    return modifiedGrid;
};

export const dulicateSection = (
    grid: BeadingGridState,
    targetWindow: BeadingGridWindow,
    sourceWindow: BeadingGridWindow
) => {
    const sourceSection = getSection(grid, sourceWindow);
    const modifiedGrid = mergeSection(grid, targetWindow, sourceSection);
    return modifiedGrid;
};

export const clearSection = (grid: BeadingGridState) => {
    return grid;
};

// SECTION: render utility functions

export const getGridSectionRenderArea = (
    grid: BeadingGridState,
    beadSize: { height: number; width: number },
    section: BeadingGridWindow
): BeadingGridRectangle => {
    const cellSize = getGridCellRenderSize(beadSize);
    const topLeftPosition = getGridCellRenderPosition(
        grid,
        beadSize,
        section.offset.rowIndex,
        section.offset.columnIndex
    );

    return {
        position: topLeftPosition,
        width: section.width * cellSize.width,
        height: section.height * cellSize.height,
    };
};

export const getGridCellRenderSize = (beadSize: {
    height: number;
    width: number;
}) => {
    const height = beadSize.height * CELL_PIXEL_RATIO;
    const width = beadSize.width * CELL_PIXEL_RATIO;

    return { height, width };
};

export const getGridCellRenderPosition = (
    grid: BeadingGridState,
    beadSize: { height: number; width: number },
    rowIndex: number,
    columnIndex: number
) => {
    const { height: cellHeight, width: cellWidth } =
        getGridCellRenderSize(beadSize);

    const cellStaggerX = cellWidth / 2;
    const cellStaggerY = cellHeight / 2;

    const getBrickOffsetX = (
        index: number,
        height: number,
        drop: number,
        fringe: number
    ) => {
        const dropOffsetNormal = Math.floor(index / drop) % 2;
        const fringeOffsetNormal = index > height - fringe ? 0 : 1;
        return cellStaggerX * dropOffsetNormal * fringeOffsetNormal;
    };

    const getPeyoteOffsetY = (index: number) => {
        const columnOffsetNormal = index % 2;
        return cellStaggerY * columnOffsetNormal;
    };

    const brickOffsetX =
        grid.options.type === "brick"
            ? getBrickOffsetX(
                  rowIndex,
                  grid.rows.length - 1,
                  grid.options.drop,
                  grid.options.fringe
              )
            : 0;
    const peyoteOffsetY = getPeyoteOffsetY(columnIndex);

    const x =
        grid.options.type === "brick"
            ? cellWidth * columnIndex + brickOffsetX
            : cellWidth * columnIndex;
    const y =
        grid.options.type === "brick"
            ? cellHeight * rowIndex
            : grid.options.type === "peyote"
              ? cellHeight * rowIndex + peyoteOffsetY
              : cellHeight * rowIndex;

    return { x, y };
};

export const getGridRenderSize = (
    grid: BeadingGridState,
    beadSize: BeadSize
) => {
    const { height: cellHeight, width: cellWidth } =
        getGridCellRenderSize(beadSize);

    const height = grid.rows.length * cellHeight * CELL_PIXEL_RATIO;
    const width =
        (grid.rows[0]?.cells.length ?? 0) * cellWidth * CELL_PIXEL_RATIO;

    return { height, width };
};

import { grid } from "@chakra-ui/react";
import { CellBlankColor, CellPixelRatio } from "./constants";
import {
    BeadingGridCellState,
    BeadingGridRow,
    BeadingGridState,
    BeadSize,
    Cell,
    GridCellPosition,
    GridWindowSet,
    GridSection,
    RenderArea,
    GridWindow
} from "./types";

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

export const insertGridRow = (state: BeadingGridState, rowIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: [
            ...state.rows.slice(0, rowIndex),
            { cells: Array.from({ length: state.options.width }, () => CellBlankColor) },
            ...state.rows.slice(rowIndex)
        ],
        options: {
            ...state.options,
            height: state.options.height + 1
        }
    };
};

export const clearGridRow = (state: BeadingGridState, rowIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row, index) => index === rowIndex
            ? { cells: row.cells.map(() => CellBlankColor) }
            : row
        ),
        options: {
            ...state.options,
            height: state.options.height - 1
        }
    };
};

export const deleteGridRow = (state: BeadingGridState, rowIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.filter((_, index) => index !== rowIndex),
        options: {
            ...state.options,
            height: state.options.height - 1
        }
    };
};

export const insertGridColumn = (state: BeadingGridState, columnIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: [
                ...row.cells.slice(0, columnIndex),
                CellBlankColor,
                ...row.cells.slice(columnIndex)
            ]
        })),
        options: {
            ...state.options,
            width: state.options.width + 1
        }
    };
};

export const clearGridColumn = (state: BeadingGridState, columnIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: row.cells.map((cell, index) => index === columnIndex
                ? CellBlankColor
                : cell
            )
        })),
        options: {
            ...state.options,
            width: state.options.width - 1
        }
    };
};

export const deleteGridColumn = (state: BeadingGridState, columnIndex: number): BeadingGridState => {
    return {
        ...state,
        rows: state.rows.map((row) => ({
            cells: row.cells.filter((_, index) => index !== columnIndex)
        })),
        options: {
            ...state.options,
            width: state.options.width - 1
        }
    };
};

export const setGridCell = (
    grid: BeadingGridState,
    cell: BeadingGridCellState
): BeadingGridState => {
    return {
        ...grid,
        rows: grid.rows.map((gridRow, rowIndex) => ({
            cells: gridRow.cells.map((gridCell, columnIndex) =>
                rowIndex === cell.rowIndex && columnIndex === cell.columnIndex
                ? cell.color
                : gridCell
            )
        }))
    };
};

export const getGridWindow = (
    startCell: GridCellPosition,
    endCell: GridCellPosition
) => {
    const topLeftRowIndex = Math.min(startCell.rowIndex, endCell.rowIndex);
    const topLeftColumnIndex = Math.min(startCell.columnIndex, endCell.columnIndex);
    const bottomRightRowIndex = Math.max(startCell.rowIndex, endCell.rowIndex);
    const bottomRightColumnIndex = Math.max(startCell.columnIndex, endCell.columnIndex);

    return {
        offset: { rowIndex: topLeftRowIndex, columnIndex: topLeftColumnIndex },
        height: bottomRightRowIndex - topLeftRowIndex + 1,
        width: bottomRightColumnIndex - topLeftColumnIndex + 1
    };
};

export const getGridWindowSet = (
    grid: BeadingGridState,
    centerSection: GridWindow
): GridWindowSet => {
    const gridHeight = grid.rows.length - 1;
    const gridWidth = grid.rows[0].cells.length - 1;
    const mirrors: GridWindow[] = [];

    // left window
    if (centerSection.offset.columnIndex > 0) {
        const leftTopLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex - centerSection.width,
            rowIndex: centerSection.offset.rowIndex
        };
        const leftBottomLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex - 1,
            rowIndex: centerSection.offset.rowIndex + centerSection.height - 1
        };
        mirrors.push(getGridWindow(leftTopLeftCell, leftBottomLeftCell));
    }

    // top window
    if (centerSection.offset.rowIndex > 0) {
        const topTopLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex,
            rowIndex: centerSection.offset.rowIndex - centerSection.height
        };
        const topBottomLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex + centerSection.width - 1,
            rowIndex: centerSection.offset.rowIndex - 1
        };
        mirrors.push(getGridWindow(topTopLeftCell, topBottomLeftCell));
    }

    // right window
    if (centerSection.offset.columnIndex + centerSection.height < gridWidth) {
        const rightTopLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex + centerSection.width,
            rowIndex: centerSection.offset.rowIndex
        };
        const rightBottomRightCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex + centerSection.width * 2 - 1,
            rowIndex: centerSection.offset.rowIndex + centerSection.height - 1
        };
        mirrors.push(getGridWindow(rightTopLeftCell, rightBottomRightCell));
    }

    // bottom window
    if (centerSection.offset.rowIndex + centerSection.height < gridHeight) {
        const bottomTopLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex,
            rowIndex: centerSection.offset.rowIndex + centerSection.height
        };
        const bottomBottomLeftCell: GridCellPosition = {
            columnIndex: centerSection.offset.columnIndex + centerSection.width - 1,
            rowIndex: centerSection.offset.rowIndex + centerSection.height * 2 - 1
        };
        mirrors.push(getGridWindow(bottomTopLeftCell, bottomBottomLeftCell));
    }
    
    return {
        center: centerSection,
        other: mirrors
    };
};

export const getGridSection = (
    grid: BeadingGridState,
    window: GridWindow
): GridSection => {
    return {
        ...window,
        rows: grid.rows
            .slice(window.offset.rowIndex, window.offset.rowIndex + window.height)
            .map((row) => ({
                cells: row.cells
                    .slice(window.offset.columnIndex, window.offset.columnIndex + window.width)
                    .map((cell) => cell)
        }))
    };
};

export const flipSection = (
    section: GridSection,
    direction: "horizontal" | "vertical"
): GridSection => {
    if (direction === "vertical") {
        for (let rowIndex = 0; rowIndex < section.height / 2; rowIndex++) {
            const currentRow = section.rows[rowIndex];
            const oppositeRow = section.rows[section.height - rowIndex - 1];
            section.rows[rowIndex] = oppositeRow;
            section.rows[section.height - rowIndex - 1] = currentRow;
        }
    }

    if (direction === "horizontal") {
        for (let rowIndex = 0; rowIndex < section.height; rowIndex++) {
            for (let columnIndex = 0; columnIndex < section.width / 2; columnIndex++) {
                const currentCell = section.rows[rowIndex].cells[columnIndex];
                const oppositeCell = section.rows[rowIndex].cells[section.width - columnIndex - 1];
                section.rows[rowIndex].cells[columnIndex] = oppositeCell;
                section.rows[rowIndex].cells[section.width - columnIndex - 1] = currentCell;
            }
        }
    }

    return section;
};

export const isPositionInBounds = (
    grid: BeadingGridState,
    offset: GridCellPosition,
    columnIndex: number,
    rowIndex: number
) => {
    return offset.rowIndex + rowIndex >= 0
        && offset.rowIndex + rowIndex < grid.rows.length
        && offset.columnIndex + columnIndex >= 0
        && offset.columnIndex + columnIndex < grid.rows[0].cells.length;
};

export const mergeSection = (
    grid: BeadingGridState,
    targetWindow: GridWindow,
    sourceWindow: GridSection,
) => {
    sourceWindow.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, columnIndex) => {
            if (isPositionInBounds(grid, targetWindow.offset, columnIndex, rowIndex) && cell !== CellBlankColor) {
                const targetRowIndex = targetWindow.offset.rowIndex + rowIndex;
                const targetColumnIndex = targetWindow.offset.columnIndex + columnIndex;
                grid.rows[targetRowIndex].cells[targetColumnIndex] = cell;
            }
        });
    });

    return {
        ...grid,
        rows: grid.rows.map((row, rowIndex) => ({
            cells: row.cells.map((cell, columnIndex) => {

                
                return cell;
            })
        }))
    };
};

export const mirrorSection = (
    grid: BeadingGridState,
    targetWindow: GridWindow,
    sourceWindow: GridWindow,
    direction: "horizontal" | "vertical"
) => {
    const sourceSection = getGridSection(grid, sourceWindow);
    const flippedSection = flipSection(sourceSection, direction);
    const modifiedGrid = mergeSection(grid, targetWindow, flippedSection);
    return modifiedGrid;
};

export const dulicateSection = (
    grid: BeadingGridState,
    targetWindow: GridWindow,
    sourceWindow: GridWindow,
) => {
    const sourceSection = getGridSection(grid, sourceWindow);
    const modifiedGrid = mergeSection(grid, targetWindow, sourceSection);
    return modifiedGrid;
};

export const clearSection = (
    grid: BeadingGridState,
    targetWindow: GridWindow,
) => {
    return grid;
};

// SECTION: render utility functions

export const getGridSectionRenderArea = (
    grid: BeadingGridState,
    beadSize: { height: number; width: number },
    section: GridWindow
): RenderArea => {
    const cellSize = getGridCellRenderSize(grid, beadSize);
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

export const getGridCellRenderSize = (
    grid: BeadingGridState,
    beadSize: { height: number; width: number }
) => {
    const height = grid.options.type === "brick"
        ? beadSize.width * CellPixelRatio
        : beadSize.height * CellPixelRatio;
    const width = grid.options.type === "brick"
        ? beadSize.height * CellPixelRatio
        : beadSize.width * CellPixelRatio;

    return { height, width };
};

export const getGridCellRenderPosition = (
    grid: BeadingGridState,
    beadSize: { height: number; width: number },
    rowIndex: number,
    columnIndex: number,
) => {
    const { height: cellHeight, width: cellWidth } = getGridCellRenderSize(grid, beadSize);
    
    const cellStaggerX = cellWidth / 2;
    const cellStaggerY = cellHeight / 2;

    const getBrickOffsetX = (index: number, height: number, drop: number, fringe: number) => {
        const dropOffsetNormal = Math.floor(index / drop) % 2;
        const fringeOffsetNormal = index > height - fringe ? 0 : 1;
        return cellStaggerX * dropOffsetNormal * fringeOffsetNormal;
    };

    const getPeyoteOffsetY = (index: number) => {
        const columnOffsetNormal = index % 2;
        return cellStaggerY * columnOffsetNormal;
    };

    const x = grid.options.type === "brick"
        ? cellWidth * columnIndex + getBrickOffsetX(rowIndex, grid.rows.length, grid.options.drop, grid.options.fringe)
        : cellWidth * columnIndex;
    const y = grid.options.type === "brick"
        ? cellHeight * rowIndex
        : grid.options.type === "peyote"
            ? cellHeight * rowIndex + getPeyoteOffsetY(columnIndex)
            : cellHeight * rowIndex;

    return { x, y };
};

export const getGridRenderSize = (
    grid: BeadingGridState,
    beadSize: BeadSize,
) => {
    const isBrickType = grid.options.type === "brick";

    const cellHeight = isBrickType
        ? beadSize.width
        : beadSize.height;
    const cellWidth = isBrickType
        ? beadSize.height
        : beadSize.width;

    const height = grid.rows.length * cellHeight * CellPixelRatio;
    const width = grid.rows[0].cells.length * cellWidth * CellPixelRatio;

    return { height, width };
};

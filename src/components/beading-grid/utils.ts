import { CellBlankColor, CellPixelRatio } from "./constants";
import {
    BeadingGridCellState,
    BeadingGridState,
    BeadSize,
    GridCellPosition,
    GridMirrorSections,
    GridSection,
    RenderArea
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

export const getGridSection = (
    grid: BeadingGridState,
    startCell: GridCellPosition,
    endCell: GridCellPosition
): GridSection => {
    const topLeftRowIndex = Math.min(startCell.rowIndex, endCell.rowIndex);
    const topLeftColumnIndex = Math.min(startCell.columnIndex, endCell.columnIndex);
    const bottomRightRowIndex = Math.max(startCell.rowIndex, endCell.rowIndex);
    const bottomRightColumnIndex = Math.max(startCell.columnIndex, endCell.columnIndex);

    const rows = grid.rows
        .slice(topLeftRowIndex, bottomRightRowIndex + 1)
        .map((row) => ({
            cells: row.cells
                .slice(topLeftColumnIndex, bottomRightColumnIndex + 1)
                .map((cell) => cell)
    }));
    
    return {
        topLeft: { rowIndex: topLeftRowIndex, columnIndex: topLeftColumnIndex },
        height: bottomRightRowIndex - topLeftRowIndex + 1,
        width: bottomRightColumnIndex - topLeftColumnIndex + 1,
        bottomRight: { rowIndex: bottomRightRowIndex, columnIndex: bottomRightColumnIndex },
        rows
    };
};

export const getGridMirrorSections = (
    grid: BeadingGridState,
    startCell: GridCellPosition,
    endCell: GridCellPosition
): GridMirrorSections => {
    const gridHeight = grid.rows.length - 1;
    const gridWidth = grid.rows[0].cells.length - 1;

    const centerSection = getGridSection(grid, startCell, endCell);
    const sectionHeight = centerSection.bottomRight.rowIndex - centerSection.topLeft.rowIndex + 1;
    const sectionWidth = centerSection.bottomRight.columnIndex - centerSection.topLeft.columnIndex + 1;

    const getMirrorSection = (
        topLeft: GridCellPosition,
        bottomRight: GridCellPosition,
        direction: "left" | "right" | "top" | "bottom"
    ) => {
        const section = getGridSection(grid, topLeft, bottomRight);
        return mirrorCopyGridSection(centerSection, section, direction);
    }

    const topTopLeftCell: GridCellPosition = {
        columnIndex: centerSection.topLeft.columnIndex,
        rowIndex: Math.max(0, centerSection.topLeft.rowIndex - sectionHeight)
    };
    const topBottomLeftCell: GridCellPosition = {
        columnIndex: centerSection.bottomRight.columnIndex,
        rowIndex: centerSection.topLeft.rowIndex - 1
    };

    const leftTopLeftCell: GridCellPosition = {
        columnIndex: Math.max(0, centerSection.topLeft.columnIndex - sectionWidth),
        rowIndex: centerSection.topLeft.rowIndex
    };
    const leftBottomLeftCell: GridCellPosition = {
        columnIndex: centerSection.topLeft.columnIndex - 1,
        rowIndex: centerSection.bottomRight.rowIndex
    };
    
    const rightTopLeftCell: GridCellPosition = {
        columnIndex: Math.min(gridWidth, centerSection.bottomRight.columnIndex + 1),
        rowIndex: centerSection.topLeft.rowIndex
    };
    const rightBottomRightCell: GridCellPosition = {
        columnIndex: Math.min(gridWidth, centerSection.bottomRight.columnIndex + sectionWidth),
        rowIndex: centerSection.bottomRight.rowIndex
    };

    const bottomTopLeftCell: GridCellPosition = {
        columnIndex: centerSection.topLeft.columnIndex,
        rowIndex: Math.min(gridHeight, centerSection.bottomRight.rowIndex + 1)
    };
    const bottomBottomLeftCell: GridCellPosition = {
        columnIndex: centerSection.bottomRight.columnIndex,
        rowIndex: Math.min(gridHeight, centerSection.bottomRight.rowIndex + sectionHeight)
    };
    
    return {
        center: centerSection,
        mirrors: [
            getMirrorSection(topTopLeftCell, topBottomLeftCell, "bottom"),
            getMirrorSection(leftTopLeftCell, leftBottomLeftCell, "left"),
            getMirrorSection(rightTopLeftCell, rightBottomRightCell, "right"),
            getMirrorSection(bottomTopLeftCell, bottomBottomLeftCell, "top")
        ]
    };
};

export const mirrorCopyGridSection = (
    sourceSection: GridSection,
    targetSection: GridSection,
    direction: "left" | "right" | "top" | "bottom"
): GridSection => {
    const targetHeight = targetSection.bottomRight.rowIndex - targetSection.topLeft.rowIndex + 1;
    const targetWidth = targetSection.bottomRight.columnIndex - targetSection.topLeft.columnIndex + 1;
    const sourceHeight = sourceSection.bottomRight.rowIndex - sourceSection.topLeft.rowIndex + 1;
    const sourceWidth = sourceSection.bottomRight.columnIndex - sourceSection.topLeft.columnIndex + 1;

    const minHeight = Math.min(targetHeight, sourceHeight);
    const minWidth = Math.min(targetWidth, sourceWidth);

    const copyCell = (sourceRow: number, sourceColumn: number, targetRow: number, targetColumn: number) => {
        targetSection.rows[targetRow].cells[targetColumn] = sourceSection.rows[sourceRow].cells[sourceColumn];
    };

    for (let rowIndex = 0; rowIndex < minHeight; rowIndex++) {
        for (let columnIndex = 0; columnIndex < minWidth; columnIndex++) {
            switch (direction) {
                case "left":
                    copyCell(rowIndex, columnIndex, rowIndex, targetWidth - columnIndex - 1);
                    break;
                case "right":
                    copyCell(rowIndex, sourceWidth - columnIndex - 1, rowIndex, columnIndex);
                    break;
                case "top":
                    copyCell(rowIndex, columnIndex, targetHeight - rowIndex - 1, columnIndex);
                    break;
                case "bottom":
                    copyCell(sourceHeight - rowIndex - 1, columnIndex, rowIndex, columnIndex);
                    break;
            }
        }
    }

    return targetSection;
};

export const insertGridSection = (
    grid: BeadingGridState,
    section: GridSection,
    cellPosition: GridCellPosition
) => {
    section.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, columnIndex) => {
            if (cell !== CellBlankColor) {
                const targetRowIndex = rowIndex + cellPosition.rowIndex;
                const targetColumnIndex = columnIndex + cellPosition.columnIndex;
                grid.rows[targetRowIndex].cells[targetColumnIndex] = cell;
            }
        });
    });

    return {
        ...grid,
        rows: grid.rows.map((row) => ({
            cells: row.cells.map((cell) => cell)
        }))
    };
};


// SECTION: render utility functions

export const getGridSectionRenderArea = (
    grid: BeadingGridState,
    beadSize: BeadSize,
    section: GridSection
): RenderArea => {
    const cellSize = getGridCellRenderSize(grid, beadSize);
    const topLeftPosition = getGridCellRenderPosition(
        grid,
        beadSize,
        section.topLeft.rowIndex,
        section.topLeft.columnIndex
    );
    const bottomRightPosition = getGridCellRenderPosition(
        grid,
        beadSize,
        section.bottomRight.rowIndex,
        section.bottomRight.columnIndex
    );
    const height = bottomRightPosition.y - topLeftPosition.y + cellSize.height;
    const width = bottomRightPosition.x - topLeftPosition.x + cellSize.width;

    return {
        position: topLeftPosition,
        width: width,
        height: height,
    };
};

export const getGridCellRenderSize = (
    grid: BeadingGridState,
    beadSize: BeadSize
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
    beadSize: BeadSize,
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

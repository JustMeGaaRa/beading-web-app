import { v6 } from "uuid";
import {
    CellBlankColor,
    CellPixelRatio,
    DefaultPatternOptions
} from "./constants";
import {
    BeadingGridCellState,
    BeadingGridMetadata,
    BeadingGridProperties,
    BeadingGridRow,
    BeadingGridState,
    BeadSize,
    PatternMetadata,
    PatternOptions,
    PatternState,
    PatternSummary
} from "./types";

export const createDefaultPattern = () => {
    return {
        patternId: `pattern-${v6()}`,
        name: "Untitled pattern",
        coverUrl: "",
        lastModified: new Date(),
        options: DefaultPatternOptions,
        grids: [],
        gridCount: 0,
    };
};

export const getSummary = (pattern: PatternState): PatternSummary => {
    const { grids, options } = pattern;
    const beadItems = new Map<string, number>();

    grids.forEach((gridState) => {
        gridState.rows.forEach((rowState) => {
            rowState.cells
                .filter((cell) => !isNullOrEmpty(cell))
                .forEach((cell) =>
                    beadItems.set(cell, (beadItems.get(cell) || 0) + 1)
                );
        });
    });
    const beads = Array.from(beadItems.keys()).map((key) => ({
        color: key,
        colorName: key,
        number: beadItems.get(key) || 0,
    }));
    const totalBeads = grids.reduce((patternTotal, gridState) => {
        const gridTotal = gridState.rows.reduce((gridTotal, rowState) => {
            const rowTotal = rowState.cells.filter((cell) => !isNullOrEmpty(cell)).length;
            return gridTotal + rowTotal;
        }, 0);
        return patternTotal + gridTotal;
    }, 0);
    const totalHeight =
    options.layout.orientation === "vertical"
        ? grids
            .reduce((totalHeight, gridState) =>
                totalHeight + gridState.rows.length * options.layout.beadSize.height,
                0
            )
        : grids
            .map((gridState) => gridState.rows.length)
            .reduce((max, height) =>
                max > height ? max : height * options.layout.beadSize.height,
                0
            );
    const totalWidth =
    options.layout.orientation === "vertical"
        ? options.layout.width
        : options.layout.width * grids.length * options.layout.beadSize.width;
    const totalSize: BeadSize = {
        title: `${totalHeight.toFixed(2)} x ${totalWidth.toFixed(2)} mm`,
        height: totalHeight,
        width: totalWidth,
    };

    return {
        totalBeads,
        beadSize: options.layout.beadSize,
        totalSize,
        beads,
    };
};

export const validatePattern = (data: any): data is PatternState => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return typeof data.patternId === "string"
        && typeof data.coverUrl === "string"
        && typeof data.lastModified === "string"
        && typeof data.name === "string"
        && typeof data.gridCount === "number"
        && validatePatternOptions(data.options)
        && Array.isArray(data.grids)
        && data.grids.every((grid: any) => validateBeadingGrid(grid));
};

export const validateBeadingGrid = (data: any): data is BeadingGridState => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return typeof data.name === "string"
        && typeof data.options === "object"
        && Array.isArray(data.rows)
        && data.rows.every((row: any) => validateBeadingGridRow(row));
};

export const validateBeadingGridRow = (data: any): data is BeadingGridRow => {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    
    return Array.isArray(data.cells)
        && data.cells.every((cell: any) => typeof cell === "string");
};

export const validatePatternOptions = (data: any): data is PatternOptions => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (typeof data.layout !== "object" || data.layout === null) {
        return false;
    }

    return typeof data.layout.width === "number"
        && typeof data.layout.height === "number"
        && typeof data.layout.orientation === "string";
}

export const createBeadingGrid = (
    gridCount: number,
    gridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const isHorizontal = options.layout.orientation === "horizontal";
    const gridName = `Grid ${gridCount + 1}`;

    switch (gridOptions.type) {
        case "square": {
            const rowCount = isHorizontal ? options.layout.height : gridOptions.height;
            const columnCount = isHorizontal ? gridOptions.width : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from({ length: columnCount }, () => CellBlankColor),
                })),
                options: gridOptions,
            };
        }
        case "peyote": {
            const rowCount = isHorizontal ? options.layout.height : gridOptions.height;
            const columnCount = isHorizontal ? gridOptions.width : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from({ length: columnCount }, () => CellBlankColor),
                })),
                options: gridOptions,
            };
        }
        case "brick": {
            const rowCount = (isHorizontal ? options.layout.height : gridOptions.height) + gridOptions.fringe;
            const columnCount = isHorizontal ? gridOptions.width : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from({ length: columnCount }, () => CellBlankColor),
                })),
                options: gridOptions,
            };
        }
    }
};

export const changePatternColor = (
    state: PatternState,
    oldColor: string,
    newColor: string
): PatternState => {
    return {
        ...state,
        grids: state.grids.map((grid) => ({
            ...grid,
            rows: grid.rows.map((row) => ({
                ...row,
                cells: row.cells.map((cell) => cell === oldColor
                    ? newColor
                    : cell
                )
            }))
        }))
    }
};

export const applyPatternOptions = (
    state: PatternState,
    options: PatternOptions
): PatternState => {
    return {
        ...state,
        grids: state.grids.map((grid) => applyBeadingGridOptions(
            grid,
            grid.options,
            options
        )),
        options: options
    };
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

export const setBeadingGridCell = (
    grid: BeadingGridState,
    cell: BeadingGridCellState
): BeadingGridState => {
    return {
        ...grid,
        rows: grid.rows.map((gridRow, rowIndex) => ({
            cells: gridRow.cells.map((gridCell, columnIndex) =>
                rowIndex === cell.row && columnIndex === cell.column
                ? cell.color
                : gridCell
            )
        }))
    };
};

export const applyBeadingGridOptions = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const modifiedGrid = {
        ...createBeadingGrid(999, modifiedGridOptions, options),
        name: grid.name
    };
    const minWidth = Math.min(
        grid.rows[0].cells.length,
        modifiedGrid.rows[0].cells.length
    );
    const minHeight = Math.min(
        grid.rows.length,
        modifiedGrid.rows.length
    );

    for (let row = 0; row < minHeight; row++) {
        for (let column = 0; column < minWidth; column++) {
            modifiedGrid.rows[row].cells[column] = grid.rows[row].cells[column];
        }
    }

    return modifiedGrid;
};

export const getPatternSize = (pattern: PatternState, options: PatternOptions) => {
    const isHorizontal = options.layout.orientation === "horizontal";
    const maxFringe = Math.max(...pattern.grids.map(grid => grid.options.type === "brick" ? grid.options.fringe : 0));
    const height = isHorizontal
        ? pattern.grids[0].rows.length + maxFringe
        : pattern.grids.reduce((totalHeight, grid) =>
            grid.options.type === "brick"
                ? totalHeight + grid.rows.length + grid.options.fringe
                : totalHeight + grid.rows.length,
            0
        );
    const width = isHorizontal
        ? pattern.grids.reduce((totalWidth, grid) =>
            totalWidth + grid.rows[0].cells.length,
            0
        )
        : pattern.grids[0].rows[0].cells.length;

    return { height, width };
};

export const getPatternMetadata = (pattern: PatternState, options: PatternOptions): PatternMetadata => {
    let offsetX = 0;
    let offsetY = 0;
    const isHorizontal = options.layout.orientation === "horizontal";

    const gridMetadata = pattern.grids.reduce((metadata, grid, index) => {
        const gridPosition = { x: offsetX, y: offsetY };
        const gridSize = getBeadingGridRenderSize(grid, options);
        const dividerPoints = isHorizontal
            ? [gridSize.width, 0, gridSize.width, gridSize.height]
            : [0, gridSize.height, gridSize.width, gridSize.height];
        const isGridDividerVisible = index < pattern.grids.length - 1;

        const gridMetadata = {
            ...metadata,
            [grid.name]: {
                position: gridPosition,
                size: gridSize,
                divider: {
                    isVisible: isGridDividerVisible,
                    points: dividerPoints,
                },
            },
        };

        offsetX = isHorizontal ? offsetX + gridSize.width : 0;
        offsetY = isHorizontal ? 0 : offsetY + gridSize.height;

        return gridMetadata;
    }, {} as Record<string, BeadingGridMetadata>);

    return {
        size: { height: offsetX, width: offsetY },
        grids: gridMetadata
    };
};

export const getBeadingGridRenderSize = (
    grid: BeadingGridState,
    options: PatternOptions,
) => {
    const isHorizontal = options.layout.orientation === "horizontal";
    const isBrickType = grid.options.type === "brick";

    const cellHeight = isBrickType
        ? options.layout.beadSize.width
        : options.layout.beadSize.height;
    const cellWidth = isBrickType
        ? options.layout.beadSize.height
        : options.layout.beadSize.width;

    const height = grid.rows.length * cellHeight * CellPixelRatio;
    const width = grid.rows[0].cells.length * cellWidth * CellPixelRatio;

    return { height, width };
};

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

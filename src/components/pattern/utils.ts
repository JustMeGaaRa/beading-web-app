import { v6 } from "uuid";
import {
    CellBlankColor,
    CellPixelRatio,
    DefaultPatternOptions
} from "./constants";
import {
    BeadingGridCellState,
    BeadingGridProperties,
    BeadingGridRow,
    BeadingGridState,
    PatternOptions,
    PatternState
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
    name: string,
    gridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const isHorizontal = options.layout.orientation === "horizontal";

    switch (gridOptions.type) {
        case "square": {
            const rowCount = isHorizontal ? options.layout.height : gridOptions.height;
            const columnCount = isHorizontal ? gridOptions.width : options.layout.width;
            return {
                name: name,
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
                name: name,
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
                name: name,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from({ length: columnCount }, () => CellBlankColor),
                })),
                options: gridOptions,
            };
        }
    }
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
    const modifiedGrid = createBeadingGrid(grid.name, modifiedGridOptions, options);
    const minWidth = Math.min(
        grid.rows[0].cells.length,
        modifiedGrid.rows[0].cells.length
    );
    const minHeight = Math.min(grid.rows.length, modifiedGrid.rows.length);

    for (let row = 0; row < minHeight; row++) {
        for (let column = 0; column < minWidth; column++) {
            modifiedGrid.rows[row].cells[column] = grid.rows[row].cells[column];
        }
    }

    return modifiedGrid;
};

export type PatternMetadata = Record<string, {
    position: { x: number; y: number };
    size: { height: number; width: number };
    divider: { isVisible: boolean; points: Array<number> };
}>;

export const getPatternMetadata = (pattern: PatternState, options: PatternOptions) => {
    let offsetX = 0;
    let offsetY = 0;
    const initialMetadata = {} as PatternMetadata;
    const isHorizontal = options.layout.orientation === "horizontal";

    const metadata = pattern.grids.reduce((metadata, grid, index) => {
        const gridPosition = { x: offsetX, y: offsetY };
        const gridSize = getBeadingGridSize(grid, options);
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
    }, initialMetadata);

    return { metadata };
};

export const getBeadingGridSize = (
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

    const height = isHorizontal
        ? options.layout.height * cellHeight * CellPixelRatio
        : grid.options.height * cellHeight * CellPixelRatio;
    const width = isHorizontal
        ? grid.options.width * cellWidth * CellPixelRatio
        : options.layout.width * cellWidth * CellPixelRatio;

    return { height, width };
};

export const isNullOrEmpty = (str?: string) => {
    return str === null || str === undefined || str === "";
};

export const deepClone = <T>(instance: T): T => {
    return JSON.parse(JSON.stringify(instance)) as T;
};

export const toJsonUri = (instance: any) => {
    const patternJson = JSON.stringify(instance, null, 2);
    const blob = new Blob([patternJson], { type: "application/json" });
    return URL.createObjectURL(blob);
};

export const downloadUri = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

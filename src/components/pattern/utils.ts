import capitalize from "just-capitalize";
import { v6 } from "uuid";
import {
    BeadingGridMetadata,
    BeadingGridProperties,
    BeadingGridRow,
    BeadingGridState,
    BeadSize,
    CellBlankColor,
    CellPixelRatio,
    getGridRenderSize,
    isNullOrEmpty
} from "../beading-grid";
import { DefaultPatternOptions } from "./constants";
import {
    PatternMetadata,
    PatternOptions,
    PatternState,
    PatternSummary
} from "./types";

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
};

export const createPattern = () => {
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

export const getPatternSummary = (pattern: PatternState): PatternSummary => {
    const { grids, options } = pattern;
    const beadItems = new Map<string, number>();

    grids.forEach((gridState) => 
        gridState.rows.forEach((rowState) => 
            rowState.cells
                .filter((cell) => !isNullOrEmpty(cell))
                .forEach((cell) => beadItems.set(cell, (beadItems.get(cell) || 0) + 1))
        )
    );

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

    const totalHeight = options.layout.orientation === "vertical"
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
    const totalWidth = options.layout.orientation === "vertical"
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

export const createGrid = (
    gridCount: number,
    gridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const isHorizontal = options.layout.orientation === "horizontal";
    const gridName = `${capitalize(gridOptions.type)} Grid ${gridCount + 1}`;

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

export const applyBeadingGridOptions = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const modifiedGrid = { ...createGrid(999, modifiedGridOptions, options), name: grid.name };
    const minWidth = Math.min(grid.rows[0].cells.length, modifiedGrid.rows[0].cells.length);
    const minHeight = Math.min(grid.rows.length, modifiedGrid.rows.length);

    for (let row = 0; row < minHeight; row++) {
        for (let column = 0; column < minWidth; column++) {
            modifiedGrid.rows[row].cells[column] = grid.rows[row].cells[column];
        }
    }

    return modifiedGrid;
};

export const getPatternSize = (pattern: PatternState, options: PatternOptions) => {
    const isHorizontal = options.layout.orientation === "horizontal";

    const maxFringe = Math.max(
        ...pattern.grids.map(grid => 
            grid.options.type === "brick"
            ? grid.options.fringe
            : 0
    ));
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

export const getPatternRenderSize = (pattern: PatternState, options: PatternOptions) => {
    const size = getPatternSize(pattern, pattern.options);
    return {
        height: size.height * CellPixelRatio * pattern.options.layout.beadSize.height,
        width: size.width * CellPixelRatio * pattern.options.layout.beadSize.width
    };
};

export const getPatternMetadata = (pattern: PatternState, options: PatternOptions): PatternMetadata => {
    let offsetColumn = 0;
    let offsetRow = 0;
    const isHorizontal = options.layout.orientation === "horizontal";
    const textOffsetColumns = 4;
    const textOffsetRows = 2;

    const gridMetadata = pattern.grids.reduce((metadata, grid, index) => {
        const dividerOffset = isHorizontal
        ? {
            columnIndex: offsetColumn,
            rowIndex: offsetRow,
        }
        : {
            columnIndex: offsetColumn - textOffsetColumns,
            rowIndex: offsetRow,
        };

        const dividerLength = isHorizontal
            ? grid.rows.length + textOffsetRows
            : grid.rows[0].cells.length + textOffsetColumns;
        
        const textOffset = isHorizontal
        ? {
            columnIndex: offsetColumn,
            rowIndex: offsetRow + grid.rows.length - 1 + textOffsetRows,
        }
        : {
            columnIndex: offsetColumn - textOffsetColumns,
            rowIndex: offsetRow,
        };

        const gridMetadata = {
            ...metadata,
            [grid.name]: {
                offset: { rowIndex: offsetRow, columnIndex: offsetColumn },
                divider: {
                    offset: dividerOffset,
                    length: dividerLength,
                },
                text: textOffset
            },
        };

        offsetColumn = isHorizontal ? offsetColumn + grid.rows[0].cells.length : 0;
        offsetRow = isHorizontal ? 0 : offsetRow + grid.rows.length;

        return gridMetadata;
    }, {} as Record<string, BeadingGridMetadata>);

    return { grids: gridMetadata };
};

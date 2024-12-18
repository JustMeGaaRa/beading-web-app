import capitalize from "just-capitalize";
import {
    BeadingGridMetadata,
    BeadingGridProperties,
    BeadingGridRow,
    BeadingGridState,
    BeadingGridType,
    CELL_BLANK_COLOR,
    CELL_PIXEL_RATIO,
    DEFAULT_GRID_OPTIONS,
    isNullOrEmpty,
} from "@repo/bead-grid";
import { v6 } from "uuid";
import {
    PatternMetadata,
    PatternOptions,
    PatternState,
    PatternSummary,
} from "../types";
import { DefaultPatternOptions } from "../constants";

export const createPattern = (
    initialGridType?: BeadingGridType
): PatternState => {
    return {
        version: "1.0.0",
        patternId: `pattern-${v6()}`,
        name: "Untitled pattern",
        coverUrl: "",
        lastModified: new Date(),
        options: DefaultPatternOptions,
        grids: initialGridType
            ? [createGrid(0, DEFAULT_GRID_OPTIONS, DefaultPatternOptions)]
            : [],
        gridCount: initialGridType ? 1 : 0,
    };
};

export const formatPatternSize = (size: { height: number; width: number }) => {
    return `${size.height.toFixed(2)} x ${size.width.toFixed(2)} mm`;
};

export const getPatternMetadata = (
    pattern: PatternState,
    options: PatternOptions
): PatternMetadata => {
    let offsetColumn = 0;
    let offsetRow = 0;
    const isHorizontal = options.layout.orientation === "horizontal";
    const textOffsetColumns = 4;
    const textOffsetRows = 2;

    const gridMetadata = pattern.grids.reduce(
        (metadata, grid) => {
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
                      rowIndex:
                          offsetRow + grid.rows.length - 1 + textOffsetRows,
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
                    text: textOffset,
                },
            };

            offsetColumn = isHorizontal
                ? offsetColumn + grid.rows[0].cells.length
                : 0;
            offsetRow = isHorizontal ? 0 : offsetRow + grid.rows.length;

            return gridMetadata;
        },
        {} as Record<string, BeadingGridMetadata>
    );

    return { grids: gridMetadata };
};

export const getPatternRealSize = (pattern: PatternState) => {
    const patternSize = getPatternSize(pattern);
    const { height, width } = pattern.options.layout.beadSize;
    const beadSize =
        pattern.options.layout.type === "brick"
            ? { height: width, width: height }
            : { height: height, width: width };

    return {
        height: patternSize.height * beadSize.height,
        width: patternSize.width * beadSize.width,
    };
};

export const getPatternRenderSize = (pattern: PatternState) => {
    const patternSize = getPatternRealSize(pattern);

    return {
        height: patternSize.height * CELL_PIXEL_RATIO,
        width: patternSize.width * CELL_PIXEL_RATIO,
    };
};

export const getPatternSize = (pattern: PatternState) => {
    const isHorizontal = pattern.options.layout.orientation === "horizontal";

    const height = isHorizontal
        ? Math.max(...pattern.grids.map((grid) => grid.rows.length))
        : pattern.grids.reduce(
              (totalHeight, grid) =>
                  grid.options.type === "brick"
                      ? totalHeight + grid.rows.length + grid.options.fringe
                      : totalHeight + grid.rows.length,
              0
          );
    const width = isHorizontal
        ? pattern.grids.reduce(
              (totalWidth, grid) => totalWidth + grid.rows[0].cells.length,
              0
          )
        : pattern.grids[0].rows[0].cells.length;

    return { height, width };
};

export const getPatternSummary = (pattern: PatternState): PatternSummary => {
    const { grids, options } = pattern;
    const beadItems = new Map<string, number>();

    grids.forEach((gridState) =>
        gridState.rows.forEach((rowState) =>
            rowState.cells
                .filter((cell) => !isNullOrEmpty(cell))
                .forEach((cell) =>
                    beadItems.set(cell, (beadItems.get(cell) || 0) + 1)
                )
        )
    );

    const beads = Array.from(beadItems.keys()).map((key) => ({
        color: key,
        colorName: key,
        number: beadItems.get(key) || 0,
    }));

    const totalBeads = grids.reduce((patternTotal, gridState) => {
        const gridTotal = gridState.rows.reduce((gridTotal, rowState) => {
            const rowTotal = rowState.cells.filter(
                (cell) => !isNullOrEmpty(cell)
            ).length;
            return gridTotal + rowTotal;
        }, 0);
        return patternTotal + gridTotal;
    }, 0);
    const totalSize = getPatternRealSize(pattern);

    return {
        totalBeads,
        beadSize: options.layout.beadSize,
        totalSize,
        beads,
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePattern = (data: any): data is PatternState => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        typeof data.version === "string" &&
        typeof data.patternId === "string" &&
        typeof data.coverUrl === "string" &&
        typeof data.lastModified === "string" &&
        typeof data.name === "string" &&
        typeof data.gridCount === "number" &&
        validatePatternOptions(data.options) &&
        Array.isArray(data.grids) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.grids.every((grid: any) => validateBeadingGrid(grid))
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBeadingGrid = (data: any): data is BeadingGridState => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        typeof data.name === "string" &&
        typeof data.options === "object" &&
        Array.isArray(data.rows) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.rows.every((row: any) => validateBeadingGridRow(row))
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBeadingGridRow = (data: any): data is BeadingGridRow => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        Array.isArray(data.cells) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.cells.every((cell: any) => typeof cell === "string")
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePatternOptions = (data: any): data is PatternOptions => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (typeof data.layout !== "object" || data.layout === null) {
        return false;
    }

    return (
        typeof data.layout.type === "string" &&
        typeof data.layout.width === "number" &&
        typeof data.layout.height === "number" &&
        typeof data.layout.orientation === "string"
    );
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
            const rowCount = isHorizontal
                ? options.layout.height
                : gridOptions.height;
            const columnCount = isHorizontal
                ? gridOptions.width
                : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from(
                        { length: columnCount },
                        () => CELL_BLANK_COLOR
                    ),
                })),
                options: gridOptions,
            };
        }
        case "peyote": {
            const rowCount = isHorizontal
                ? options.layout.height
                : gridOptions.height;
            const columnCount = isHorizontal
                ? gridOptions.width
                : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from(
                        { length: columnCount },
                        () => CELL_BLANK_COLOR
                    ),
                })),
                options: gridOptions,
            };
        }
        case "brick": {
            const rowCount =
                (isHorizontal ? options.layout.height : gridOptions.height) +
                gridOptions.fringe;
            const columnCount = isHorizontal
                ? gridOptions.width
                : options.layout.width;
            return {
                name: gridName,
                rows: Array.from({ length: rowCount }, () => ({
                    cells: Array.from(
                        { length: columnCount },
                        () => CELL_BLANK_COLOR
                    ),
                })),
                options: gridOptions,
            };
        }
    }
};

export const applyBeadingGridOptions = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties,
    options: PatternOptions
): BeadingGridState => {
    const modifiedGrid = {
        ...createGrid(999, modifiedGridOptions, options),
        name: grid.name,
    };
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

export const applyPatternOptions = (
    state: PatternState,
    options: PatternOptions
): PatternState => {
    return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
            applyBeadingGridOptions(grid, grid.options, options)
        ),
        options: options,
    };
};

export const changePatternColor = (
    state: PatternState,
    oldColor: string,
    newColor: string
): PatternState => {
    return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) => ({
            ...grid,
            rows: grid.rows.map((row) => ({
                ...row,
                cells: row.cells.map((cell) =>
                    cell === oldColor ? newColor : cell
                ),
            })),
        })),
    };
};

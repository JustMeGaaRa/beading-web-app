import {
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridState,
    BrickGridProperties,
    DefaultGridProperties,
    getCurrentGridName,
    getGridHeight,
    getNextGridName,
} from "@repo/bead-grid";
import { PatternOptions, PatternState } from "../types";

export const mergeOptions = (
    patternOptions: PatternOptions,
    gridOptions: BeadingGridProperties
): BeadingGridProperties => {
    const isHorizontal = patternOptions.orientation === "horizontal";
    if (patternOptions.type === "brick")
        return {
            type: patternOptions.type,
            height: isHorizontal ? patternOptions.height : gridOptions.height,
            width: isHorizontal ? gridOptions.width : patternOptions.width,
            drop:
                "drop" in gridOptions
                    ? gridOptions.drop
                    : DefaultGridProperties.drop,
            fringe:
                "fringe" in gridOptions
                    ? gridOptions.fringe
                    : DefaultGridProperties.fringe,
        } satisfies BrickGridProperties;

    return {
        type: patternOptions.type,
        height: isHorizontal ? patternOptions.height : gridOptions.height,
        width: isHorizontal ? gridOptions.width : patternOptions.width,
    } satisfies BeadingGridProperties;
};

export const createGrid = (
    options: BeadingGridProperties,
    offset?: BeadingGridOffset,
    previousName?: string
): BeadingGridState => {
    return {
        gridId: `grid-${crypto.randomUUID()}`,
        offset: offset ?? { rowIndex: 0, columnIndex: 0 },
        name: previousName
            ? getNextGridName(options, previousName)
            : getCurrentGridName(options, previousName),
        cells: [],
        options: options,
    };
};

export const createPattern = (
    patternOptions: PatternOptions,
    gridOptions: BeadingGridProperties
): PatternState => {
    return {
        version: "1.0.0",
        patternId: `pattern-${crypto.randomUUID()}`,
        name: "Untitled pattern",
        coverUrl: "",
        lastModified: new Date(),
        options: patternOptions,
        grids: [createGrid(mergeOptions(patternOptions, gridOptions))],
        gridCount: 1,
    };
};

export const getPatternSize = (
    grids: Array<BeadingGridState>,
    patternOptions: PatternOptions
) => {
    const isHorizontal = patternOptions.orientation === "horizontal";

    const height = isHorizontal
        ? Math.max(...grids.map((grid) => getGridHeight(grid.options)))
        : grids.reduce(
              (totalHeight, grid) => totalHeight + getGridHeight(grid.options),
              0
          );
    const width = isHorizontal
        ? grids.reduce((totalWidth, grid) => totalWidth + grid.options.width, 0)
        : Math.max(...grids.map((grid) => grid.options.width));

    return { height, width };
};

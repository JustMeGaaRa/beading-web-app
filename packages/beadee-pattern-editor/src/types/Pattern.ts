import {
    BeadingGrid,
    changeColor,
    DefaultGridProperties,
    getGridHeight,
    gridApplyOptions,
} from "@beadee/grid-editor";
import { PatternOptions } from "./PatternOptions";
import { createGrid, mergeOptions } from "../utils";

export type Pattern = {
    version: string;
    patternId: string;
    name: string;
    coverUrl: string;
    lastModified: Date;
    options: PatternOptions;
    grids: Array<BeadingGrid>;
    gridCount: number;
};

export const setPatternName = (pattern: Pattern, newName: string): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        name: newName,
    };
};

export const addPatternGrid = (pattern: Pattern): Pattern => {
    const previousGrid = pattern.grids.at(-1);
    const currentGrid = createGrid(
        mergeOptions(pattern.options, DefaultGridProperties),
        getGridOffset(previousGrid, pattern.options.orientation),
        previousGrid!.name
    );
    return {
        ...pattern,
        lastModified: new Date(),
        grids: [...pattern.grids, currentGrid],
        gridCount: pattern.gridCount + 1,
    };
};

export const updatePatternGrid = (
    pattern: Pattern,
    grid: BeadingGrid
): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        grids: pattern.grids.map((current) =>
            current.gridId === grid.gridId ? current : grid
        ),
    };
};

export const getGridOffset = (
    previousGrid: BeadingGrid | undefined,
    orientation: "horizontal" | "vertical"
) => {
    if (previousGrid === undefined || previousGrid === null)
        return { columnIndex: 0, rowIndex: 0 };

    const currentGridOffset = {
        columnIndex:
            orientation === "horizontal"
                ? previousGrid.offset.columnIndex + previousGrid.options.width
                : 0,
        rowIndex:
            orientation === "vertical"
                ? previousGrid.offset.rowIndex +
                  getGridHeight(previousGrid.options)
                : 0,
    };

    return currentGridOffset;
};

export const mapGridsOffset = (
    grids: Array<BeadingGrid>,
    orientation: "horizontal" | "vertical"
) => {
    return grids.map((grid, index) => ({
        ...grid,
        offset: getGridOffset(
            index === 0 ? undefined : grids.at(index - 1),
            orientation
        ),
    }));
};

export const deletePatternGrid = (
    pattern: Pattern,
    gridId: string
): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        grids: mapGridsOffset(
            pattern.grids.filter((current) => current.gridId !== gridId),
            pattern.options.orientation
        ),
    };
};

export const changePatternColor = (
    pattern: Pattern,
    oldColor: string,
    newColor: string
): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        grids: pattern.grids.map((grid) =>
            changeColor(grid, oldColor, newColor)
        ),
    };
};

export const applyPatternOptions = (
    pattern: Pattern,
    newOptions: PatternOptions
): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        grids: mapGridsOffset(
            pattern.grids.map((grid) =>
                gridApplyOptions(grid, mergeOptions(newOptions, grid.options))
            ),
            newOptions.orientation
        ),
        options: newOptions,
    };
};

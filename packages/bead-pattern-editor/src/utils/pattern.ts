import {
    BeadingGridMetadata,
    BeadingGridProperties,
    BeadingGridState,
    BrickGridProperties,
    DefaultGridProperties,
    getGridActualHeight,
} from "@repo/bead-grid";
import { PatternMetadata, PatternOptions } from "../types";

export const getPatternSize = (
    grids: Array<BeadingGridState>,
    patternOptions: PatternOptions
) => {
    const isHorizontal = patternOptions.layout.orientation === "horizontal";

    const height = isHorizontal
        ? Math.max(...grids.map((grid) => getGridActualHeight(grid.options)))
        : grids.reduce(
              (totalHeight, grid) =>
                  totalHeight + getGridActualHeight(grid.options),
              0
          );
    const width = isHorizontal
        ? grids.reduce((totalWidth, grid) => totalWidth + grid.options.width, 0)
        : Math.max(...grids.map((grid) => grid.options.width));

    return { height, width };
};

export const createGridOptions = (
    patternOptions: PatternOptions
): BeadingGridProperties => {
    const isHorizontal = patternOptions.layout.orientation === "horizontal";
    return patternOptions.layout.type === "brick"
        ? ({
              type: patternOptions.layout.type,
              height: isHorizontal
                  ? patternOptions.layout.height
                  : DefaultGridProperties.height,
              width: isHorizontal
                  ? DefaultGridProperties.width
                  : patternOptions.layout.width,
              drop: DefaultGridProperties.drop,
              fringe: DefaultGridProperties.fringe,
          } satisfies BrickGridProperties)
        : ({
              type: patternOptions.layout.type,
              height: isHorizontal
                  ? patternOptions.layout.height
                  : DefaultGridProperties.height,
              width: isHorizontal
                  ? DefaultGridProperties.width
                  : patternOptions.layout.width,
          } satisfies BeadingGridProperties);
};

export const synchronizeOptions = (
    patternOptions: PatternOptions,
    gridOptions: BeadingGridProperties
): [PatternOptions, BeadingGridProperties] => {
    const isHorizontal = patternOptions.layout.orientation === "horizontal";
    const modifiedPatternOptions = {
        ...patternOptions,
        layout: {
            ...patternOptions.layout,
            height: isHorizontal
                ? patternOptions.layout.height
                : gridOptions.height,
            width: isHorizontal
                ? gridOptions.width
                : patternOptions.layout.width,
        },
    } satisfies PatternOptions;
    const modifiedGridOptions = {
        ...gridOptions,
        height: isHorizontal
            ? patternOptions.layout.height
            : gridOptions.height,
        width: isHorizontal ? gridOptions.width : patternOptions.layout.width,
    };
    return [modifiedPatternOptions, modifiedGridOptions];
};

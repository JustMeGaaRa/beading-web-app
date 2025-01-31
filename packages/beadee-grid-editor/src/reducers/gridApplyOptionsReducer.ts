import {
    BeadingGrid,
    BeadingGridProperties,
    deepEqualGridOptions,
    createGridBounds,
    indeciesInBounds,
} from "../types";
import { getCurrentGridName } from "../utils";

export const gridApplyOptions = (
    grid: BeadingGrid,
    modifiedGridOptions: BeadingGridProperties
): BeadingGrid => {
    if (deepEqualGridOptions(grid.options, modifiedGridOptions)) {
        return grid;
    }

    const modifiedGrid = {
        ...grid,
        name: getCurrentGridName(modifiedGridOptions, grid.name),
        options: modifiedGridOptions,
        cells: grid.cells.filter((cell) => {
            const area = createGridBounds(modifiedGridOptions, grid.offset);
            return indeciesInBounds(area, cell.offset);
        }),
    };

    return modifiedGrid;
};

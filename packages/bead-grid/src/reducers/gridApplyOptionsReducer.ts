import {
    BeadingGridState,
    BeadingGridProperties,
    deepEqualGridOptions,
} from "../types";
import { getGridBounds, indeciesInBounds, getCurrentGridName } from "../utils";

export const gridApplyOptions = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties
): BeadingGridState => {
    if (deepEqualGridOptions(grid.options, modifiedGridOptions)) {
        return grid;
    }

    const modifiedGrid = {
        ...grid,
        name: getCurrentGridName(modifiedGridOptions, grid.name),
        options: modifiedGridOptions,
        cells: grid.cells.filter((cell) => {
            const area = getGridBounds(modifiedGridOptions);
            return indeciesInBounds(area, cell.offset);
        }),
    };

    return modifiedGrid;
};

import {
    BeadingGridState,
    BeadingGridProperties,
    deepEqualGridOptions,
} from "../types";
import { getGridBounds, indeciesInBounds, restoreGridName } from "../utils";

export const gridApplyOptionsReducer = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties
): BeadingGridState => {
    if (deepEqualGridOptions(grid.options, modifiedGridOptions)) {
        return grid;
    }

    const modifiedGrid = {
        ...grid,
        name: restoreGridName(modifiedGridOptions, grid.name),
        options: modifiedGridOptions,
        cells: grid.cells.filter((cell) => {
            const area = getGridBounds(modifiedGridOptions);
            return indeciesInBounds(area, cell.offset);
        }),
    };

    return modifiedGrid;
};

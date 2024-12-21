import { BeadingGridState, BeadingGridProperties } from "../types";
import { areEqualDeep, isInBounds, restoreGridName } from "../utils";

export const gridApplyOptions = (
    grid: BeadingGridState,
    modifiedGridOptions: BeadingGridProperties
): BeadingGridState => {
    if (areEqualDeep(grid.options, modifiedGridOptions)) {
        return grid;
    }

    const modifiedGrid = {
        ...grid,
        name: restoreGridName(modifiedGridOptions, grid.name),
        options: modifiedGridOptions,
        cells: grid.cells.filter((cell) =>
            isInBounds(modifiedGridOptions, cell.offset)
        ),
    };

    return modifiedGrid;
};

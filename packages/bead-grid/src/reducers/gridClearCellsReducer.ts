import { BeadingGridCell, BeadingGrid } from "../types";
import { clear } from "../utils";

export const gridClearCells = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): BeadingGrid => {
    return clear(grid, cells);
};

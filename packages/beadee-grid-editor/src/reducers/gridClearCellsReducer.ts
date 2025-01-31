import { BeadingGridCell, BeadingGrid, clear } from "../types";

export const gridClearCells = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): BeadingGrid => {
    return clear(grid, cells);
};

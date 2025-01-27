import { BeadingGridCell, BeadingGridSection, BeadingGrid } from "../types";
import { clear, copy } from "../utils";

export const gridCutSection = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): [BeadingGrid, BeadingGridSection] => {
    const selectedSection = copy(grid, cells);
    const modifiedGrid = clear(grid, cells);
    return [modifiedGrid, selectedSection];
};

import {
    BeadingGridCell,
    BeadingGridSection,
    BeadingGrid,
    cut,
} from "../types";

export const gridCutSection = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): [BeadingGrid, BeadingGridSection] => {
    return cut(grid, cells);
};

import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridState,
} from "../types";
import { getGridSectionBounds, paste } from "../utils";

export const gridPasteSection = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>,
    offset: BeadingGridOffset
): BeadingGridState => {
    const sectionBounds = getGridSectionBounds(cells);
    const modifiedGrid = paste(grid, sectionBounds, offset);
    return modifiedGrid;
};

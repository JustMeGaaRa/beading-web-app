import { BeadingGridCellState, BeadingGridState } from "../types";
import { clear, flip, FlipAxis, getGridSectionBounds, paste } from "../utils";

export const gridFlipSectionReducer = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>,
    direction: FlipAxis
): BeadingGridState => {
    const sectionBounds = getGridSectionBounds(cells);
    const flippedSection = flip(sectionBounds, direction);
    const clearedGrid = clear(grid, cells);
    const modifiedGrid = paste(
        clearedGrid,
        flippedSection,
        flippedSection.topLeft
    );
    return modifiedGrid;
};

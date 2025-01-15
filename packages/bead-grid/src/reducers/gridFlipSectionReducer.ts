import { BeadingGridCellState, BeadingGridState } from "../types";
import { clear, flip, FlipAxis, getGridSectionBounds, paste } from "../utils";

export const gridFlipSection = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>,
    axis: FlipAxis
): BeadingGridState => {
    const sectionBounds = getGridSectionBounds(cells);
    const flippedSection = flip(sectionBounds, axis);
    const clearedGrid = clear(grid, cells);
    const modifiedGrid = paste(
        clearedGrid,
        flippedSection,
        flippedSection.topLeft
    );
    return modifiedGrid;
};

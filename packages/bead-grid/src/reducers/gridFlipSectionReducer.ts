import { BeadingGridCell, BeadingGrid, createGridSection } from "../types";
import { clear, flip, FlipAxis, paste } from "../utils";

export const gridFlipSection = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>,
    axis: FlipAxis
): BeadingGrid => {
    const sectionBounds = createGridSection(cells);
    const flippedSection = flip(sectionBounds, axis);
    const clearedGrid = clear(grid, cells);
    const modifiedGrid = paste(
        clearedGrid,
        flippedSection,
        flippedSection.offset
    );
    return modifiedGrid;
};

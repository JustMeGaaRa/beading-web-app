import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGrid,
    createGridSection,
    paste,
} from "../types";

export const gridPasteSection = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>,
    offset: BeadingGridOffset
): BeadingGrid => {
    const sectionBounds = createGridSection(cells);
    const modifiedGrid = paste(grid, sectionBounds, offset);
    return modifiedGrid;
};

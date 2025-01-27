import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGrid,
    createGridSection,
} from "../types";
import { clear, paste, shift } from "../utils";

export const gridMoveSection = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>,
    offset: BeadingGridOffset
): BeadingGrid => {
    const sectionBounds = createGridSection(cells);
    const shiftedSection = shift(sectionBounds, offset);
    const clearedGrid = clear(grid, cells);
    const modifiedGrid = paste(
        clearedGrid,
        shiftedSection,
        shiftedSection.offset
    );
    return modifiedGrid;
};

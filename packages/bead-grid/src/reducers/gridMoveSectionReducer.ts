import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridState,
} from "../types";
import { clear, getGridSectionBounds, paste, shift } from "../utils";

export const gridMoveSectionReducer = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>,
    offset: BeadingGridOffset
): BeadingGridState => {
    const sectionBounds = getGridSectionBounds(cells);
    const shiftedSection = shift(sectionBounds, offset);
    const clearedGrid = clear(grid, cells);
    const modifiedGrid = paste(
        clearedGrid,
        shiftedSection,
        shiftedSection.topLeft
    );
    return modifiedGrid;
};

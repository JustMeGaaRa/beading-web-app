import {
    BeadingGridCellState,
    BeadingGridSection,
    BeadingGridState,
} from "../types";
import { clear, copy, getGridSectionBounds } from "../utils";

export const gridCutSectionReducer = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>
): [BeadingGridState, BeadingGridSection] => {
    const sectionBounds = getGridSectionBounds(cells);
    const selectedSection = copy(grid, sectionBounds);
    const modifiedGrid = clear(grid, cells);
    return [modifiedGrid, selectedSection];
};

import { BeadingGridCellState, BeadingGridState } from "../types";
import { clear } from "../utils";

export const gridClearCellsReducer = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>
): BeadingGridState => {
    return clear(grid, cells);
};

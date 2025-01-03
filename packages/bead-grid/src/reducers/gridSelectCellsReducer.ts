import { BeadingGridCellState, BeadingGridState } from "../types";
import { gridSetCellReducer } from "./gridSetCellReducer";

export const gridSelectCellsReducer = (
    grid: BeadingGridState,
    modifiedCells: Array<BeadingGridCellState>
): BeadingGridState => {
    return modifiedCells
        .map((cell) => ({ ...cell, isSelected: true }))
        .reduce(gridSetCellReducer, grid);
};

import { BeadingGridCellState, BeadingGridState } from "../types";
import { gridSetCell } from "./gridSetCellReducer";

export const gridSelectCells = (
    grid: BeadingGridState,
    modifiedCells: Array<BeadingGridCellState>
): BeadingGridState => {
    return modifiedCells
        .map((cell) => ({ ...cell, isSelected: true }))
        .reduce(gridSetCell, grid);
};

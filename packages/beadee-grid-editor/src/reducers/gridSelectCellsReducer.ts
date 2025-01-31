import { BeadingGridCell, BeadingGrid } from "../types";
import { gridSetCell } from "./gridSetCellReducer";

export const gridSelectCells = (
    grid: BeadingGrid,
    modifiedCells: Array<BeadingGridCell>
): BeadingGrid => {
    return modifiedCells
        .map((cell) => ({ ...cell, isSelected: true }))
        .reduce(gridSetCell, grid);
};

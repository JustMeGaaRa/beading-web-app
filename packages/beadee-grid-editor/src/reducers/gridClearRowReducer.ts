import { BeadingGrid } from "../types";

export const gridClearRow = (
    state: BeadingGrid,
    rowIndex: number
): BeadingGrid => {
    return {
        ...state,
        cells: state.cells.filter((cell) => cell.offset.rowIndex !== rowIndex),
    };
};

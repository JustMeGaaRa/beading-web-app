import { BeadingGridState } from "../types";

export const gridClearRow = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    return {
        ...state,
        cells: state.cells.filter((cell) => cell.offset.rowIndex !== rowIndex),
    };
};

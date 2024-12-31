import { BeadingGridState } from "../types";

export const gridClearRowReducer = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    return {
        ...state,
        cells: state.cells.filter((cell) => cell.offset.rowIndex !== rowIndex),
    };
};

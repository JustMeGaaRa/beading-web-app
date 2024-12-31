import { BeadingGridState } from "../types";

export const gridClearColumnReducer = (
    state: BeadingGridState,
    columnIndex: number
): BeadingGridState => {
    return {
        ...state,
        cells: state.cells.filter(
            (cell) => cell.offset.columnIndex !== columnIndex
        ),
    };
};

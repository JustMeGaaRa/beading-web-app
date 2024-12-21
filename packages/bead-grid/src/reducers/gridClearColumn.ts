import { BeadingGridState } from "../types";

export const gridClearColumn = (
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

import { BeadingGrid } from "../types";

export const gridClearColumn = (
    state: BeadingGrid,
    columnIndex: number
): BeadingGrid => {
    return {
        ...state,
        cells: state.cells.filter(
            (cell) => cell.offset.columnIndex !== columnIndex
        ),
    };
};

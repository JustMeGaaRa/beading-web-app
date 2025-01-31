import { BeadingGrid } from "../types";

export const gridDeleteColumn = (
    state: BeadingGrid,
    columnIndex: number
): BeadingGrid => {
    if (columnIndex < 0 || columnIndex >= state.options.width) {
        return state;
    }

    return {
        ...state,
        cells: state.cells
            // filter our the cells in the current column
            .filter((cell) => cell.offset.columnIndex !== columnIndex)
            // shift all cells in the next columns to the left
            .map((cell) =>
                cell.offset.columnIndex > columnIndex
                    ? {
                          ...cell,
                          offset: {
                              rowIndex: cell.offset.rowIndex,
                              columnIndex: cell.offset.columnIndex - 1,
                          },
                      }
                    : cell
            ),
        options: {
            ...state.options,
            width: state.options.width - 1,
        },
    };
};

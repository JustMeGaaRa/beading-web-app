import { BeadingGridState } from "../types";

export const gridInsertColumnReducer = (
    state: BeadingGridState,
    columnIndex: number
): BeadingGridState => {
    if (columnIndex < 0 || columnIndex >= state.options.width) {
        return state;
    }

    return {
        ...state,
        cells: state.cells
            // shift all cells in the next columns to the right
            .map((cell) =>
                cell.offset.columnIndex >= columnIndex
                    ? {
                          ...cell,
                          offset: {
                              rowIndex: cell.offset.rowIndex,
                              columnIndex: cell.offset.columnIndex + 1,
                          },
                      }
                    : cell
            ),
        options: {
            ...state.options,
            width: state.options.width + 1,
        },
    };
};

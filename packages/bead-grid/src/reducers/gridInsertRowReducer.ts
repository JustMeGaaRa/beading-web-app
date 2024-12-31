import { BeadingGridState } from "../types";

export const gridInsertRowReducer = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    if (rowIndex < 0 || rowIndex >= state.options.height) {
        return state;
    }

    return {
        ...state,
        cells: state.cells
            // shift all cells in the next rows down
            .map((cell) =>
                cell.offset.rowIndex >= rowIndex
                    ? {
                          ...cell,
                          offset: {
                              rowIndex: cell.offset.rowIndex + 1,
                              columnIndex: cell.offset.columnIndex,
                          },
                      }
                    : cell
            ),
        options: {
            ...state.options,
            height: state.options.height + 1,
        },
    };
};

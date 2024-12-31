import { BeadingGridState } from "../types";

export const gridDeleteRowReducer = (
    state: BeadingGridState,
    rowIndex: number
): BeadingGridState => {
    if (rowIndex < 0 || rowIndex >= state.options.height) {
        return state;
    }

    return {
        ...state,
        cells: state.cells
            // filter our the cells in the current row
            .filter((cell) => cell.offset.rowIndex !== rowIndex)
            // shift all cells in the next rows up
            .map((cell) =>
                cell.offset.rowIndex > rowIndex
                    ? {
                          ...cell,
                          offset: {
                              rowIndex: cell.offset.rowIndex - 1,
                              columnIndex: cell.offset.columnIndex,
                          },
                      }
                    : cell
            ),
        options: {
            ...state.options,
            height: state.options.height - 1,
        },
    };
};

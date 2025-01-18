import {
    gridApplyOptions,
    gridReducer,
    DefaultGridProperties,
    getGridHeight,
    BeadingGridState,
} from "@repo/bead-grid";
import { PatternActions } from "../actions";
import { PatternState } from "../types";
import { createGrid, mergeOptions } from "../utils";

const getCurrentGridOffset = (
    previousGrid: BeadingGridState | undefined,
    orientation: "horizontal" | "vertical"
) => {
    if (!previousGrid) return { columnIndex: 0, rowIndex: 0 };

    const currentGridOffset = {
        columnIndex:
            orientation === "horizontal"
                ? previousGrid!.offset!.columnIndex +
                  previousGrid!.options.width
                : 0,
        rowIndex:
            orientation === "vertical"
                ? previousGrid!.offset!.rowIndex +
                  getGridHeight(previousGrid!.options)
                : 0,
    };

    return currentGridOffset;
};

const mapGridOffset = (
    grids: Array<BeadingGridState>,
    orientation: "horizontal" | "vertical"
) => {
    return grids.map((grid, index) => ({
        ...grid,
        offset: getCurrentGridOffset(
            index === 0 ? undefined : grids.at(index - 1),
            orientation
        ),
    }));
};

export const patternReducer = (
    state: PatternState,
    action: PatternActions
): PatternState => {
    switch (action.type) {
        case "PATTERN_CHANGE_NAME":
            return {
                ...state,
                lastModified: new Date(),
                name: action.name,
            };
        case "PATTERN_ADD_GRID":
            const previousGrid = state.grids.at(-1);
            const currentGrid = createGrid(
                mergeOptions(state.options, DefaultGridProperties),
                getCurrentGridOffset(previousGrid, state.options.orientation),
                previousGrid!.name
            );
            return {
                ...state,
                lastModified: new Date(),
                grids: [...state.grids, currentGrid],
                gridCount: state.gridCount + 1,
            };
        case "PATTERN_DELETE_GRID":
            return {
                ...state,
                lastModified: new Date(),
                grids: mapGridOffset(
                    state.grids.filter((grid) => grid.gridId !== action.gridId),
                    state.options.orientation
                ),
            };
        case "PATTERN_REPLACE_COLOR":
            return {
                ...state,
                lastModified: new Date(),
                grids: state.grids.map((grid) => ({
                    ...grid,
                    cells: grid.cells.map((cell) =>
                        cell.color === action.oldColor
                            ? { ...cell, color: action.newColor }
                            : cell
                    ),
                })),
            };
        case "PATTERN_APPLY_OPTIONS":
            return {
                ...state,
                lastModified: new Date(),
                grids: mapGridOffset(
                    state.grids.map((grid) =>
                        gridApplyOptions(
                            grid,
                            mergeOptions(action.options, grid.options)
                        )
                    ),
                    action.options.orientation
                ),
                options: action.options,
            };
        case "BEADING_GRID_APPLY_OPTIONS":
        case "BEADING_GRID_SET_CELL":
        case "BEADING_GRID_SELECT_CELLS":
        case "BEADING_GRID_CLEAR_CELLS":
        case "BEADING_GRID_ADD_COLUMN_BEFORE":
        case "BEADING_GRID_ADD_COLUMN_AFTER":
        case "BEADING_GRID_DELETE_COLUMN":
        case "BEADING_GRID_CLEAR_COLUMN":
        case "BEADING_GRID_ADD_ROW_BEFORE":
        case "BEADING_GRID_ADD_ROW_AFTER":
        case "BEADING_GRID_DELETE_ROW":
        case "BEADING_GRID_CLEAR_ROW":
        case "BEADING_GRID_PASTE_SECTION":
        case "BEADING_GRID_FLIP_SECTION":
            return {
                ...state,
                lastModified: new Date(),
                grids: state.grids.map((grid) =>
                    grid.gridId === action.gridId
                        ? gridReducer(grid, action)
                        : grid
                ),
            };
        default:
            return state;
    }
};

import {
    BeadingGridProperties,
    DefaultGridProperties,
    gridApplyOptionsReducer,
    createDefault,
    gridReducer,
} from "@repo/bead-grid";
import { PatternActions } from "../actions";
import { PatternOptions, PatternState } from "../types";
import { v6 } from "uuid";
import { createGridOptions } from "../utils";

export const createPattern = (
    patternOptions: PatternOptions,
    gridOptions?: BeadingGridProperties
): PatternState => {
    return {
        version: "1.0.0",
        patternId: `pattern-${v6()}`,
        name: "Untitled pattern",
        coverUrl: "",
        lastModified: new Date(),
        options: patternOptions,
        grids: [
            createDefault(gridOptions ?? createGridOptions(patternOptions)),
        ],
        gridCount: 1,
    };
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
                name: action.payload.name,
            };
        case "PATTERN_CHANGE_COLOR":
            return changePatternColor(
                state,
                action.payload.oldColor,
                action.payload.newColor
            );
        case "PATTERN_APPLY_OPTIONS":
            return applyPatternOptions(state, action.payload.options);
        case "PATTERN_ADD_GRID":
            return {
                ...state,
                lastModified: new Date(),
                grids: [
                    ...state.grids,
                    createDefault({
                        ...DefaultGridProperties,
                        type: state.options.layout.type,
                        height: state.options.layout.height,
                        width: state.options.layout.width,
                    } as any),
                ],
                gridCount: state.gridCount + 1,
            };
        case "PATTERN_DELETE_GRID":
            return {
                ...state,
                lastModified: new Date(),
                grids: state.grids.filter(
                    (grid) => grid.name !== action.payload.name
                ),
            };
        case "BEADING_GRID_APPLY_OPTIONS":
        case "BEADING_GRID_SET_CELL":
        case "BEADING_GRID_SET_SELECTED_CELLS":
        case "BEADING_GRID_CLEAR_CELLS":
        case "BEADING_GRID_ADD_COLUMN_BEFORE":
        case "BEADING_GRID_ADD_COLUMN_AFTER":
        case "BEADING_GRID_DELETE_COLUMN":
        case "BEADING_GRID_CLEAR_COLUMN":
        case "BEADING_GRID_ADD_ROW_BEFORE":
        case "BEADING_GRID_ADD_ROW_AFTER":
        case "BEADING_GRID_DELETE_ROW":
        case "BEADING_GRID_CLEAR_ROW":
            return {
                ...state,
                lastModified: new Date(),
                grids: state.grids.map((grid) => gridReducer(grid, action)),
            };
        default:
            return state;
    }
};

export const applyPatternOptions = (
    state: PatternState,
    options: PatternOptions
): PatternState => {
    return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
            gridApplyOptionsReducer(grid, grid.options)
        ),
        options: options,
    };
};

export const changePatternColor = (
    state: PatternState,
    oldColor: string,
    newColor: string
): PatternState => {
    return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) => ({
            ...grid,
            cells: grid.cells.map((cell) =>
                cell.color === oldColor ? { ...cell, color: newColor } : cell
            ),
        })),
    };
};

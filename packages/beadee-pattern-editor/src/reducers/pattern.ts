import { gridReducer } from "@beadee/grid-editor";
import { PatternActions, PatternGridAction } from "../actions";
import {
    Pattern,
    addPatternGrid,
    applyPatternOptions,
    changePatternColor,
    deletePatternGrid,
    mapGridsOffset,
    setPatternName,
    updatePatternGrid,
} from "../types";

export const patternReducer = (
    state: Pattern,
    action: PatternActions
): Pattern => {
    switch (action.type) {
        case "PATTERN_CHANGE_NAME":
            return setPatternName(state, action.name);
        case "PATTERN_ADD_GRID":
            return addPatternGrid(state);
        case "PATTERN_UPDATE_GRID":
            return updatePatternGrid(state, action.grid);
        case "PATTERN_DELETE_GRID":
            return deletePatternGrid(state, action.gridId);
        case "PATTERN_REPLACE_COLOR":
            return changePatternColor(state, action.oldColor, action.newColor);
        case "PATTERN_APPLY_OPTIONS":
            return applyPatternOptions(state, action.options);
        case "BEADING_GRID_APPLY_OPTIONS":
        case "BEADING_GRID_SET_CELL":
        case "BEADING_GRID_SELECT_CELLS":
        case "BEADING_GRID_CLEAR_CELLS":
        case "BEADING_GRID_INSERT_COLUMN":
        case "BEADING_GRID_DELETE_COLUMN":
        case "BEADING_GRID_CLEAR_COLUMN":
        case "BEADING_GRID_INSERT_ROW":
        case "BEADING_GRID_DELETE_ROW":
        case "BEADING_GRID_CLEAR_ROW":
        case "BEADING_GRID_PASTE_SECTION":
        case "BEADING_GRID_FLIP_SECTION":
        case "BEADING_GRID_MOVE_SECTION":
            return applyPatternGridAction(state, action);
        default:
            return state;
    }
};

export const applyPatternGridAction = (
    pattern: Pattern,
    action: PatternGridAction
): Pattern => {
    return {
        ...pattern,
        lastModified: new Date(),
        grids: mapGridsOffset(
            pattern.grids.map((grid) =>
                grid.gridId === action.gridId ? gridReducer(grid, action) : grid
            ),
            pattern.options.orientation
        ),
    };
};

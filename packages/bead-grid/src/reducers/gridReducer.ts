import { GridActions } from "../actions";
import { BeadingGridState } from "../types";
import { gridApplyOptionsReducer } from "./gridApplyOptionsReducer";
import { gridClearColumnReducer } from "./gridClearColumnReducer";
import { gridClearRowReducer } from "./gridClearRowReducer";
import { gridDeleteColumnReducer } from "./gridDeleteColumnReducer";
import { gridDeleteRowReducer } from "./gridDeleteRowReducer";
import { gridInsertColumnReducer } from "./gridInsertColumnReducer";
import { gridInsertRowReducer } from "./gridInsertRowReducer";
import { gridSetCellReducer } from "./gridSetCellReducer";
import { gridSetSelectedCellsReducer } from "./gridSetSelectedCellsReducer";

// user actions: duplicate, move, mirror, cut, select, select all, deselect all
//
// mirror = copy + flip + paste
// duplicate = copy + shift + paste
// move = copy + shift + paste
// flip = copy + flip + paste
// cut = copy + clear

// 1. Select cursor tool - Drag to select area - select mirror tool - click highlighted area to apply
// 2. Select cursor tool - drag to select area - select flip tool
// 3. Select cursor tool - drag to select area - cut tool - click on cell - paste tool
// 4. Select cursor tool - drag to select area - duplicate tool - click on highlighted area to apply
// 5. Select pencil tool - click on cell to apply OR press down mouse and drag to apply
// 6. Select eraser tool - click on cell to apply OR press down mouse and drag to apply

export const gridReducer = (
    state: BeadingGridState,
    action: GridActions
): BeadingGridState => {
    switch (action.type) {
        case "BEADING_GRID_SET_CELL":
            return gridSetCellReducer(state, action.payload.cell);
        case "BEADING_GRID_APPLY_OPTIONS":
            return gridApplyOptionsReducer(state, action.payload.options);
        case "BEADING_GRID_ADD_COLUMN_BEFORE":
            return gridInsertColumnReducer(state, action.payload.column);
        case "BEADING_GRID_ADD_COLUMN_AFTER":
            return gridInsertColumnReducer(state, action.payload.column + 1);
        case "BEADING_GRID_DELETE_COLUMN":
            return gridDeleteColumnReducer(state, action.payload.column);
        case "BEADING_GRID_CLEAR_COLUMN":
            return gridClearColumnReducer(state, action.payload.column);
        case "BEADING_GRID_ADD_ROW_BEFORE":
            return gridInsertRowReducer(state, action.payload.row);
        case "BEADING_GRID_ADD_ROW_AFTER":
            return gridInsertRowReducer(state, action.payload.row + 1);
        case "BEADING_GRID_DELETE_ROW":
            return gridDeleteRowReducer(state, action.payload.row);
        case "BEADING_GRID_CLEAR_ROW":
            return gridClearRowReducer(state, action.payload.row);
        case "BEADING_GRID_SET_SELECTED_CELLS":
            return gridSetSelectedCellsReducer(state, action.payload.cells);
        // case "BEADING_GRID_MIRROR_SECTION":
        //     return mirrorSection(
        //         state,
        //         action.payload.target,
        //         action.payload.source,
        //         "horizontal"
        //     );
        // case "BEADING_GRID_DUPLICATE_SECTION":
        //     return dulicateSection(
        //         state,
        //         action.payload.target,
        //         action.payload.source
        //     );
        // case "BEADING_GRID_CLEAR_SECTION":
        //     return clearSection(state);
        default:
            return state;
    }
};

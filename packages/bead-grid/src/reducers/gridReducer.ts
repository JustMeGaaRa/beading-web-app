import { GridActions } from "../actions";
import { BeadingGridState } from "../types";
import { gridApplyOptions } from "./gridApplyOptions";
import { gridClearColumn } from "./gridClearColumn";
import { gridClearRow } from "./gridClearRow";
import { gridDeleteColumn } from "./gridDeleteColumn";
import { gridDeleteRow } from "./gridDeleteRow";
import { gridInsertColumn } from "./gridInsertColumn";
import { gridInsertRow } from "./gridInsertRow";
import { gridSetCell, gridSetCells } from "./gridSetCell";

export const gridReducer = (
    state: BeadingGridState,
    action: GridActions
): BeadingGridState => {
    switch (action.type) {
        case "BEADING_GRID_SET_CELL":
            return gridSetCell(state, action.payload.cell);
        case "BEADING_GRID_APPLY_OPTIONS":
            return gridApplyOptions(state, action.payload.options);
        case "BEADING_GRID_ADD_COLUMN_BEFORE":
            return gridInsertColumn(state, action.payload.column);
        case "BEADING_GRID_ADD_COLUMN_AFTER":
            return gridInsertColumn(state, action.payload.column + 1);
        case "BEADING_GRID_DELETE_COLUMN":
            return gridDeleteColumn(state, action.payload.column);
        case "BEADING_GRID_CLEAR_COLUMN":
            return gridClearColumn(state, action.payload.column);
        case "BEADING_GRID_ADD_ROW_BEFORE":
            return gridInsertRow(state, action.payload.row);
        case "BEADING_GRID_ADD_ROW_AFTER":
            return gridInsertRow(state, action.payload.row + 1);
        case "BEADING_GRID_DELETE_ROW":
            return gridDeleteRow(state, action.payload.row);
        case "BEADING_GRID_CLEAR_ROW":
            return gridClearRow(state, action.payload.row);
        case "BEADING_GRID_SET_SELECTED_CELLS":
            return gridSetCells(state, action.payload.cells);
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

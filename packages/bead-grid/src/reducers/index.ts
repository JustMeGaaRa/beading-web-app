import {
    setGridCell,
    insertGridColumn,
    deleteGridColumn,
    clearGridColumn,
    insertGridRow,
    deleteGridRow,
    clearGridRow,
    mirrorSection,
    dulicateSection,
    clearSection,
    applyBeadingGridOptions,
} from "../utils";
import { GridActions } from "../actions";
import { BeadingGridState } from "../types";

export const gridReducer = (
    state: BeadingGridState,
    action: GridActions
): BeadingGridState => {
    switch (action.type) {
        case "BEADING_GRID_SET_CELL":
            return setGridCell(state, action.payload.cell);
        case "BEADING_GRID_APPLY_OPTIONS":
            return applyBeadingGridOptions(state, action.payload.options);
        case "BEADING_GRID_ADD_COLUMN_BEFORE":
            return insertGridColumn(state, action.payload.column);
        case "BEADING_GRID_ADD_COLUMN_AFTER":
            return insertGridColumn(state, action.payload.column + 1);
        case "BEADING_GRID_DELETE_COLUMN":
            return deleteGridColumn(state, action.payload.column);
        case "BEADING_GRID_CLEAR_COLUMN":
            return clearGridColumn(state, action.payload.column);
        case "BEADING_GRID_ADD_ROW_BEFORE":
            return insertGridRow(state, action.payload.row);
        case "BEADING_GRID_ADD_ROW_AFTER":
            return insertGridRow(state, action.payload.row + 1);
        case "BEADING_GRID_DELETE_ROW":
            return deleteGridRow(state, action.payload.row);
        case "BEADING_GRID_CLEAR_ROW":
            return clearGridRow(state, action.payload.row);
        case "BEADING_GRID_MIRROR_SECTION":
            return mirrorSection(
                state,
                action.payload.target,
                action.payload.source,
                "horizontal"
            );
        case "BEADING_GRID_DUPLICATE_SECTION":
            return dulicateSection(
                state,
                action.payload.target,
                action.payload.source
            );
        case "BEADING_GRID_CLEAR_SECTION":
            return clearSection(state);
        default:
            return state;
    }
};

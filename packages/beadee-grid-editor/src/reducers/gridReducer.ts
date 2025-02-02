import { GridActions } from "../actions";
import { BeadingGrid } from "../types";
import { gridApplyOptions } from "./gridApplyOptionsReducer";
import { gridClearColumn } from "./gridClearColumnReducer";
import { gridClearRow } from "./gridClearRowReducer";
import { gridDeleteColumn } from "./gridDeleteColumnReducer";
import { gridDeleteRow } from "./gridDeleteRowReducer";
import { gridInsertColumn } from "./gridInsertColumnReducer";
import { gridInsertRow } from "./gridInsertRowReducer";
import { gridSetCell } from "./gridSetCellReducer";
import { gridSelectCells } from "./gridSelectCellsReducer";
import { gridFlipSection } from "./gridFlipSectionReducer";
import { gridClearCells } from "./gridClearCellsReducer";
import { gridPasteSection } from "./gridPasteSectionReducer";
import { gridMoveSection } from "./gridMoveSectionReducer";

// user actions:
// - clear selected = clear
// - copy section = copy
// - paste section = paste
// - cut section = copy + clear + paste
// - select area = hittest + select
// - select all = hittest + select
// - reset selected = select
// - mirror section = copy + flip + paste
// - duplicate section = copy + shift + paste
// - move section = copy + shift + clear + paste
// - flip section = copy + flip + clear + paste

// primitive actions:
// - copy
// - paste
// - clear
// - flip
// - shift
// - set

// user tools:
// - Select cursor tool - Drag to select area - select mirror tool - click highlighted area to apply
// - Select cursor tool - drag to select area - select flip tool
// - Select cursor tool - drag to select area - cut tool - click on cell - paste tool
// - Select cursor tool - drag to select area - duplicate tool - click on highlighted area to apply
// - Select pencil tool - click on cell to apply OR press down mouse and drag to apply
// - Select eraser tool - click on cell to apply OR press down mouse and drag to apply

export const gridReducer = (
    state: BeadingGrid,
    action: GridActions
): BeadingGrid => {
    switch (action.type) {
        case "BEADING_GRID_APPLY_OPTIONS":
            return gridApplyOptions(state, action.options);
        case "BEADING_GRID_SET_CELL":
            return gridSetCell(state, action.cell);
        case "BEADING_GRID_SELECT_CELLS":
            return gridSelectCells(state, action.cells);
        case "BEADING_GRID_CLEAR_CELLS":
            return gridClearCells(state, action.cells);
        case "BEADING_GRID_INSERT_COLUMN":
            return gridInsertColumn(state, action.column);
        case "BEADING_GRID_DELETE_COLUMN":
            return gridDeleteColumn(state, action.column);
        case "BEADING_GRID_CLEAR_COLUMN":
            return gridClearColumn(state, action.column);
        case "BEADING_GRID_INSERT_ROW":
            return gridInsertRow(state, action.row);
        case "BEADING_GRID_DELETE_ROW":
            return gridDeleteRow(state, action.row);
        case "BEADING_GRID_CLEAR_ROW":
            return gridClearRow(state, action.row);
        case "BEADING_GRID_PASTE_SECTION":
            return gridPasteSection(state, action.cells, action.offset);
        case "BEADING_GRID_FLIP_SECTION":
            return gridFlipSection(state, action.cells, action.axis);
        case "BEADING_GRID_MOVE_SECTION":
            return gridMoveSection(state, action.cells, action.offset);
        default:
            return state;
    }
};

import {
    BeadingGridBounds,
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSection,
} from "../types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
};

export type GridName = string | "all";

export type GridApplyOptionsAction = Action<
    "BEADING_GRID_APPLY_OPTIONS",
    { options: BeadingGridProperties }
>;
export type GridSetCellAction = Action<
    "BEADING_GRID_SET_CELL",
    { cell: BeadingGridCellState }
>;
export type GridSetSelectedCellsAction = Action<
    "BEADING_GRID_SELECT_CELLS",
    { cells: Array<BeadingGridCellState> }
>;
export type GridClearCellsAction = Action<
    "BEADING_GRID_CLEAR_CELLS",
    { cells: Array<BeadingGridCellState> }
>;
export type GridAddColumnBeforeAction = Action<
    "BEADING_GRID_ADD_COLUMN_BEFORE",
    { column: number }
>;
export type GridAddColumnAfterAction = Action<
    "BEADING_GRID_ADD_COLUMN_AFTER",
    { column: number }
>;
export type GridDeleteColumnAction = Action<
    "BEADING_GRID_DELETE_COLUMN",
    { column: number }
>;
export type GridClearColumnAction = Action<
    "BEADING_GRID_CLEAR_COLUMN",
    { column: number }
>;
export type GridAddRowBeforeAction = Action<
    "BEADING_GRID_ADD_ROW_BEFORE",
    { row: number }
>;
export type GridAddRowAfterAction = Action<
    "BEADING_GRID_ADD_ROW_AFTER",
    { row: number }
>;
export type GridDeleteRowAction = Action<
    "BEADING_GRID_DELETE_ROW",
    { row: number }
>;
export type GridClearRowAction = Action<
    "BEADING_GRID_CLEAR_ROW",
    { row: number }
>;
export type GridCopySectionAction = Action<
    "BEADING_GRID_COPY_SECTION",
    { bounds: BeadingGridBounds }
>;
export type GridPasteSectionAction = Action<
    "BEADING_GRID_PASTE_SECTION",
    { section: BeadingGridSection; offset: BeadingGridOffset }
>;

export type GridActions =
    | GridSetCellAction
    | GridClearCellsAction
    | GridApplyOptionsAction
    | GridAddRowBeforeAction
    | GridAddRowAfterAction
    | GridDeleteRowAction
    | GridClearRowAction
    | GridAddColumnBeforeAction
    | GridAddColumnAfterAction
    | GridDeleteColumnAction
    | GridClearColumnAction
    | GridSetSelectedCellsAction;

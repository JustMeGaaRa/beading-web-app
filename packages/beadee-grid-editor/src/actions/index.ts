import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
    FlipAxis,
} from "../types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
} & TPayload;

export type GridName = string | "all";

export type GridApplyOptionsAction = Action<
    "BEADING_GRID_APPLY_OPTIONS",
    { options: BeadingGridProperties }
>;
export type GridSetCellAction = Action<
    "BEADING_GRID_SET_CELL",
    { cell: BeadingGridCell }
>;
export type GridSetSelectedCellsAction = Action<
    "BEADING_GRID_SELECT_CELLS",
    { cells: Array<BeadingGridCell> }
>;
export type GridClearCellsAction = Action<
    "BEADING_GRID_CLEAR_CELLS",
    { cells: Array<BeadingGridCell> }
>;
export type GridInsertColumnAction = Action<
    "BEADING_GRID_INSERT_COLUMN",
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
export type GridInsertRowAction = Action<
    "BEADING_GRID_INSERT_ROW",
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
export type GridPasteSectionAction = Action<
    "BEADING_GRID_PASTE_SECTION",
    { cells: Array<BeadingGridCell>; offset: BeadingGridOffset }
>;
export type GridFlipSectionAction = Action<
    "BEADING_GRID_FLIP_SECTION",
    { cells: Array<BeadingGridCell>; axis: FlipAxis }
>;
export type GridMoveSectionAction = Action<
    "BEADING_GRID_MOVE_SECTION",
    { cells: Array<BeadingGridCell>; offset: BeadingGridOffset }
>;

export type GridActions =
    | GridSetCellAction
    | GridClearCellsAction
    | GridApplyOptionsAction
    | GridInsertRowAction
    | GridDeleteRowAction
    | GridClearRowAction
    | GridInsertColumnAction
    | GridDeleteColumnAction
    | GridClearColumnAction
    | GridSetSelectedCellsAction
    | GridPasteSectionAction
    | GridFlipSectionAction
    | GridMoveSectionAction;

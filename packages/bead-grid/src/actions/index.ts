import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
} from "../types";
import { FlipAxis } from "../utils";

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
export type GridPasteSectionAction = Action<
    "BEADING_GRID_PASTE_SECTION",
    { cells: Array<BeadingGridCell>; offset: BeadingGridOffset }
>;
export type GridFlipSectionAction = Action<
    "BEADING_GRID_FLIP_SECTION",
    { cells: Array<BeadingGridCell>; axis: FlipAxis }
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
    | GridSetSelectedCellsAction
    | GridPasteSectionAction
    | GridFlipSectionAction;

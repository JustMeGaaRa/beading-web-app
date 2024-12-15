import {
    BeadingGridCell,
    BeadingGridProperties,
    BeadingGridWindow,
} from "@repo/bead-grid";
import { PatternOptions } from "./types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
};

type GridName = string | "all";

export type PatternSetNameAction = Action<
    "PATTERN_CHANGE_NAME",
    { name: string }
>;
export type PatternChangeColorAction = Action<
    "PATTERN_CHANGE_COLOR",
    {
        oldColor: string;
        newColor: string;
    }
>;
export type PatternApplyOptionsAction = Action<
    "PATTERN_APPLY_OPTIONS",
    { options: PatternOptions }
>;
export type GridAddNewAction = Action<"BEADING_GRID_ADD", unknown>;
export type GridDeleteAction = Action<"BEADING_GRID_DELETE", { name: string }>;
export type GridApplyOptionsAction = Action<
    "BEADING_GRID_APPLY_OPTIONS",
    {
        name: string;
        options: BeadingGridProperties;
    }
>;
export type GridSetCellAction = Action<
    "BEADING_GRID_SET_CELL",
    { name: string; cell: BeadingGridCell }
>;
export type GridClearCellsAction = Action<
    "BEADING_GRID_CLEAR_CELLS",
    {
        name: GridName;
        cells: Array<BeadingGridCell>;
    }
>;
export type GridAddColumnBeforeAction = Action<
    "BEADING_GRID_ADD_COLUMN_BEFORE",
    {
        name: GridName;
        column: number;
    }
>;
export type GridAddColumnAfterAction = Action<
    "BEADING_GRID_ADD_COLUMN_AFTER",
    {
        name: GridName;
        column: number;
    }
>;
export type GridDeleteColumnAction = Action<
    "BEADING_GRID_DELETE_COLUMN",
    { name: GridName; column: number }
>;
export type GridClearColumnAction = Action<
    "BEADING_GRID_CLEAR_COLUMN",
    { name: GridName; column: number }
>;
export type GridAddRowBeforeAction = Action<
    "BEADING_GRID_ADD_ROW_BEFORE",
    { name: GridName; row: number }
>;
export type GridAddRowAfterAction = Action<
    "BEADING_GRID_ADD_ROW_AFTER",
    { name: GridName; row: number }
>;
export type GridDeleteRowAction = Action<
    "BEADING_GRID_DELETE_ROW",
    { name: GridName; row: number }
>;
export type GridClearRowAction = Action<
    "BEADING_GRID_CLEAR_ROW",
    { name: GridName; row: number }
>;
export type GridMirrorSectionAction = Action<
    "BEADING_GRID_MIRROR_SECTION",
    {
        name: GridName;
        target: BeadingGridWindow;
        source: BeadingGridWindow;
        direction: "vertical" | "horizontal";
    }
>;
export type GridDuplicateSectionAction = Action<
    "BEADING_GRID_DUPLICATE_SECTION",
    {
        name: GridName;
        target: BeadingGridWindow;
        source: BeadingGridWindow;
    }
>;
export type GridClearSectionAction = Action<
    "BEADING_GRID_CLEAR_SECTION",
    {
        name: GridName;
        section: BeadingGridWindow;
    }
>;

export type PatternActions =
    | PatternSetNameAction
    | PatternChangeColorAction
    | PatternApplyOptionsAction
    | GridSetCellAction
    | GridClearCellsAction
    | GridAddNewAction
    | GridDeleteAction
    | GridApplyOptionsAction
    | GridAddRowBeforeAction
    | GridAddRowAfterAction
    | GridDeleteRowAction
    | GridClearRowAction
    | GridAddColumnBeforeAction
    | GridAddColumnAfterAction
    | GridDeleteColumnAction
    | GridClearColumnAction
    | GridMirrorSectionAction
    | GridDuplicateSectionAction
    | GridClearSectionAction;

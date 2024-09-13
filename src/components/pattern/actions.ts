import { BeadingGridCellState, BeadingGridProperties, GridCellPosition, GridSection } from "../beading-grid";
import { PatternOptions, PatternState } from "./types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
}

type GridName = string | "all";

export type PatternResetAction = Action<"setPattern", { pattern: PatternState }>;
export type PatternSetNameAction = Action<"setPatternName", { name: string }>;
export type PatternSetCoverAction = Action<"setPatternCover", { coverUrl: string }>;
export type PatternChangeColorAction = Action<"changePatternColor", { oldColor: string; newColor: string }>;
export type PatternApplyOptionsAction = Action<"applyPatternOptions", { options: PatternOptions }>;
export type GridSetCellAction = Action<"setGridCell", { name: string, cell: BeadingGridCellState }>;
export type GridClearCellsAction = Action<"clearGridCells", { name: GridName, cells: Array<BeadingGridCellState> }>;
export type GridAddNewAction = Action<"addGrid", {}>;
export type GridDeleteAction = Action<"deleteGrid", { name: string }>;
export type GridApplyOptionsAction = Action<"applyGridOptions", { name: string, options: BeadingGridProperties }>;
export type GridAddRowAboveAction = Action<"addGridRowAbove", { name: GridName, row: number }>;
export type GridAddRowBelowAction = Action<"addGridRowBelow", { name: GridName, row: number }>;
export type GridDeleteRowAction = Action<"deleteGridRow", { name: GridName, row: number }>;
export type GridClearRowAction = Action<"clearGridRow", { name: GridName, row: number }>;
export type GridAddColumnLeftAction = Action<"addGridColumnLeft", { name: GridName, column: number }>;
export type GridAddColumnRightAction = Action<"addGridColumnRight", { name: GridName, column: number }>;
export type GridDeleteColumnAction = Action<"deleteGridColumn", { name: GridName, column: number }>;
export type GridClearColumnAction = Action<"clearGridColumn", { name: GridName, column: number }>;
export type GridSetSectionAction = Action<"setGridSection", { name: GridName, section: GridSection, cellPosition: GridCellPosition }>;

export type PatternActions = 
    | PatternResetAction
    | PatternSetNameAction
    | PatternSetCoverAction
    | PatternChangeColorAction
    | PatternApplyOptionsAction
    | GridSetCellAction
    | GridClearCellsAction
    | GridAddNewAction
    | GridDeleteAction
    | GridApplyOptionsAction
    | GridAddRowAboveAction
    | GridAddRowBelowAction
    | GridDeleteRowAction
    | GridClearRowAction
    | GridAddColumnLeftAction
    | GridAddColumnRightAction
    | GridDeleteColumnAction
    | GridClearColumnAction
    | GridSetSectionAction;

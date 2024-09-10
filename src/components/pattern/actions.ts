import { BeadingGridCellState, BeadingGridProperties, PatternOptions, PatternState } from "./types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
}

type GridName = string | "all";

export type SetPatternAction = Action<"setPattern", { pattern: PatternState }>;
export type SetPatternNameAction = Action<"setPatternName", { name: string }>;
export type SetPatternCoverAction = Action<"setPatternCover", { coverUrl: string }>;
export type ChangePatternColorAction = Action<"changePatternColor", { oldColor: string; newColor: string }>;
export type ApplyPatternOptionsAction = Action<"applyPatternOptions", { options: PatternOptions }>;
export type SetGridCellColorAction = Action<"setGridCellColor", { name: string, cell: BeadingGridCellState }>;
export type AddGridAction = Action<"addGrid", {}>;
export type DeleteGridAction = Action<"deleteGrid", { name: string }>;
export type ApplyGridOptionsAction = Action<"applyGridOptions", { name: string, options: BeadingGridProperties }>;
export type DeleteGridRowAction = Action<"deleteGridRow", { name: GridName, row: number }>;
export type ClearGridRowAction = Action<"clearGridRow", { name: GridName, row: number }>;
export type AddGridRowAboveAction = Action<"addGridRowAbove", { name: GridName, row: number }>;
export type AddGridRowBelowAction = Action<"addGridRowBelow", { name: GridName, row: number }>;
export type DeleteGridColumnAction = Action<"deleteGridColumn", { name: GridName, column: number }>;
export type ClearGridColumnAction = Action<"clearGridColumn", { name: GridName, column: number }>;
export type AddGridColumnLeftAction = Action<"addGridColumnLeft", { name: GridName, column: number }>;
export type AddGridColumnRightAction = Action<"addGridColumnRight", { name: GridName, column: number }>;

export type PatternActions = 
    | SetPatternAction
    | SetPatternNameAction
    | SetPatternCoverAction
    | ChangePatternColorAction
    | ApplyPatternOptionsAction
    | SetGridCellColorAction
    | AddGridAction
    | DeleteGridAction
    | ApplyGridOptionsAction
    | DeleteGridRowAction
    | ClearGridRowAction
    | AddGridRowAboveAction
    | AddGridRowBelowAction
    | DeleteGridColumnAction
    | ClearGridColumnAction
    | AddGridColumnLeftAction
    | AddGridColumnRightAction;

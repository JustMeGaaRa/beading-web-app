import { BeadingGridCellState, BeadingGridProperties, PatternOptions, PatternState } from "./types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
}

export type SetPatternAction = Action<"setPattern", { pattern: PatternState }>;
export type SetPatternNameAction = Action<"setPatternName", { name: string }>;
export type SetPatternCoverAction = Action<"setPatternCover", { coverUrl: string }>;
export type ChangePatternColorAction = Action<"changePatternColor", { oldColor: string; newColor: string }>;
export type SetGridCellColorAction = Action<"setGridCellColor", { name: string, cell: BeadingGridCellState }>;
export type AddGridAction = Action<"addGrid", {}>;
export type DeleteGridAction = Action<"deleteGrid", { name: string }>;
export type ApplyPatternOptionsAction = Action<"applyPatternOptions", { options: PatternOptions }>;
export type ApplyGridOptionsAction = Action<"applyGridOptions", { name: string, options: BeadingGridProperties }>;

export type PatternActions = 
    | SetPatternAction
    | SetPatternNameAction
    | SetPatternCoverAction
    | ChangePatternColorAction
    | SetGridCellColorAction
    | AddGridAction
    | DeleteGridAction
    | ApplyPatternOptionsAction
    | ApplyGridOptionsAction;

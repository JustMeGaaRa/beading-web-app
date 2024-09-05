import { BeadingGridCellState, BeadingGridProperties, PatternOptions } from "./types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
}

export type SetNameAction = Action<"setName", { name: string }>;
export type SetGridCellColorAction = Action<"setGridCellColor", { name: string, cell: BeadingGridCellState }>;
export type AddGridAction = Action<"addGrid", {}>;
export type DeleteGridAction = Action<"deleteGrid", { name: string }>;
export type ApplyPatternOptionsAction = Action<"applyPatternOptions", { options: PatternOptions }>;
export type ApplyGridOptionsAction = Action<"applyGridOptions", { name: string, options: BeadingGridProperties }>;
export type ResetPatternAction = Action<"resetPattern", {}>;

export type PatternActions = 
    | SetNameAction
    | SetGridCellColorAction
    | AddGridAction
    | DeleteGridAction
    | ApplyPatternOptionsAction
    | ApplyGridOptionsAction
    | ResetPatternAction;

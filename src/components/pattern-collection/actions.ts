import { PatternState } from "../pattern";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
}

export type AddPatternAction = Action<"addPattern", { pattern: PatternState }>;
export type DeletePatternAction = Action<"deletePattern", { patternId: string }>;
export type SavePatternAction = Action<"savePattern", { pattern: PatternState }>;

export type PatternCollectionActions = 
    | AddPatternAction
    | DeletePatternAction
    | SavePatternAction;

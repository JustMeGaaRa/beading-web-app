import { PatternState } from "../pattern";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
};

export type PatternAddAction = Action<"PATTERN_ADD", { pattern: PatternState }>;
export type PatternDeleteAction = Action<
    "PATTERN_DELETE",
    { patternId: string }
>;
export type PatternSaveAction = Action<
    "PATTERN_SAVE",
    { pattern: PatternState }
>;

export type PatternCollectionActions =
    | PatternAddAction
    | PatternDeleteAction
    | PatternSaveAction;

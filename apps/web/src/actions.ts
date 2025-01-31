import { Pattern } from "@beadee/pattern-editor";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
};

export type PatternAddAction = Action<"PATTERN_ADD", { pattern: Pattern }>;
export type PatternDeleteAction = Action<
    "PATTERN_DELETE",
    { patternId: string }
>;
export type PatternSaveAction = Action<"PATTERN_SAVE", { pattern: Pattern }>;

export type PatternCollectionActions =
    | PatternAddAction
    | PatternDeleteAction
    | PatternSaveAction;

import { GridActions } from "../../../bead-grid/src/actions";
import { PatternOptions } from "../types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
} & TPayload;

export type PatternSetNameAction = Action<
    "PATTERN_CHANGE_NAME",
    { name: string }
>;
export type PatternReplaceColorAction = Action<
    "PATTERN_REPLACE_COLOR",
    {
        oldColor: string;
        newColor: string;
    }
>;
export type PatternApplyOptionsAction = Action<
    "PATTERN_APPLY_OPTIONS",
    { options: PatternOptions }
>;
export type PatternAddGridAction = Action<"PATTERN_ADD_GRID", {}>;
export type PatternDeleteGridAction = Action<
    "PATTERN_DELETE_GRID",
    { gridId: string }
>;
export type PatternGridAction = GridActions & {
    gridId: string | "all";
};

export type PatternActions =
    | PatternSetNameAction
    | PatternReplaceColorAction
    | PatternApplyOptionsAction
    | PatternAddGridAction
    | PatternDeleteGridAction
    | PatternGridAction;

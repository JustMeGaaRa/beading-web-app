import { GridActions } from "../../../bead-grid/src/actions";
import { PatternOptions } from "../types";

type Action<TAction extends string, TPayload> = {
    type: TAction;
    payload: TPayload;
};

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
export type PatternAddGridAction = Action<"PATTERN_ADD_GRID", unknown>;
export type PatternDeleteGridAction = Action<
    "PATTERN_DELETE_GRID",
    { name: string }
>;

export type PatternActions =
    | PatternSetNameAction
    | PatternChangeColorAction
    | PatternApplyOptionsAction
    | PatternAddGridAction
    | PatternDeleteGridAction
    | GridActions;

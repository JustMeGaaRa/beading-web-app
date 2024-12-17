import {
    PatternAddGridAction,
    PatternDeleteGridAction,
    PatternApplyOptionsAction,
    PatternChangeColorAction,
    PatternSetNameAction,
} from "../actions";
import { PatternOptions } from "../types";

export const changePatternNameAction = (
    name: string
): PatternSetNameAction => ({
    type: "PATTERN_CHANGE_NAME",
    payload: { name },
});

export const changePatternColorAction = (
    oldColor: string,
    newColor: string
): PatternChangeColorAction => ({
    type: "PATTERN_CHANGE_COLOR",
    payload: { oldColor, newColor },
});

export const applyPatternOptionsAction = (
    options: PatternOptions
): PatternApplyOptionsAction => ({
    type: "PATTERN_APPLY_OPTIONS",
    payload: { options },
});

export const addBeadingGridAction = (): PatternAddGridAction => ({
    type: "PATTERN_ADD_GRID",
    payload: {},
});

export const deleteBeadingGridAction = (
    name: string
): PatternDeleteGridAction => ({
    type: "PATTERN_DELETE_GRID",
    payload: { name },
});

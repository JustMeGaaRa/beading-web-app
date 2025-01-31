import { Pattern } from "@beadee/pattern-editor";
import {
    PatternAddAction,
    PatternDeleteAction,
    PatternSaveAction,
} from "./actions";

export const addPatternAction = (pattern: Pattern): PatternAddAction => {
    return {
        type: "PATTERN_ADD",
        payload: { pattern },
    };
};

export const deletePatternAction = (patternId: string): PatternDeleteAction => {
    return {
        type: "PATTERN_DELETE",
        payload: { patternId },
    };
};

export const savePatternAction = (pattern: Pattern): PatternSaveAction => {
    return {
        type: "PATTERN_SAVE",
        payload: { pattern },
    };
};

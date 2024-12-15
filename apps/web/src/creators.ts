import { PatternState } from "@repo/bead-pattern-editor";
import {
    PatternAddAction,
    PatternDeleteAction,
    PatternSaveAction,
} from "./actions";

export const addPattern = (pattern: PatternState): PatternAddAction => {
    return {
        type: "PATTERN_ADD",
        payload: { pattern },
    };
};

export const deletePattern = (patternId: string): PatternDeleteAction => {
    return {
        type: "PATTERN_DELETE",
        payload: { patternId },
    };
};

export const savePattern = (pattern: PatternState): PatternSaveAction => {
    return {
        type: "PATTERN_SAVE",
        payload: { pattern },
    };
};

import { useReducer } from "react";
import { Pattern } from "../types";
import {
    wrapWithUndoRedoReducer,
    wrapWithUndoRedoState,
    wrapWithChangeTrackerState,
    wrapWithChangeTrackerReducer,
} from "../store";
import { patternReducer } from "../reducers";

export const useBeadeePatternReducer = (initialState: Pattern) => {
    return useReducer(
        wrapWithChangeTrackerReducer(wrapWithUndoRedoReducer(patternReducer)),
        wrapWithChangeTrackerState(wrapWithUndoRedoState(initialState))
    );
};

import { PatternCollectionActions } from "./actions";
import { PatternCollectionStore } from "./store";

export const patternCollectionReducer = (state: PatternCollectionStore, action: PatternCollectionActions): PatternCollectionStore => {
    switch (action.type) {
        case "addPattern":
            return {
                ...state,
                patterns: [...state.patterns, action.payload.pattern]
            };
        case "deletePattern":
            return {
                ...state,
                patterns: state.patterns.filter((pattern) => pattern.patternId !== action.payload.patternId)
            };
        case "savePattern":
            return {
                ...state,
                patterns: state.patterns.map((pattern) => pattern.patternId === action.payload.pattern.patternId
                    ? action.payload.pattern
                    : pattern
                )
            };
        default:
            return state;
    }
};

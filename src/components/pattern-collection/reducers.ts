import { PatternCollectionActions } from "./actions";
import { PatternCollectionStore } from "./store";

export const patternCollectionReducer = (
  state: PatternCollectionStore,
  action: PatternCollectionActions
): PatternCollectionStore => {
  switch (action.type) {
    case "PATTERN_ADD":
      return {
        ...state,
        patterns: [...state.patterns, action.payload.pattern],
      };
    case "PATTERN_DELETE":
      return {
        ...state,
        patterns: state.patterns.filter(
          (pattern) => pattern.patternId !== action.payload.patternId
        ),
      };
    case "PATTERN_SAVE":
      return {
        ...state,
        patterns: state.patterns.map((pattern) =>
          pattern.patternId === action.payload.pattern.patternId
            ? action.payload.pattern
            : pattern
        ),
      };
    default:
      return state;
  }
};

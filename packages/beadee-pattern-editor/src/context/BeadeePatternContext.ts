import { createContext, Dispatch } from "react";
import { PatternActions } from "../actions";
import { UndoRedoAction, UndoRedoState } from "../store/history";
import { ChangeTrackerAction, ChangeTrackerState } from "../store/tracker";
import { Pattern } from "../types";

export const BeadeePatternContext = createContext<{
    state: ChangeTrackerState<UndoRedoState<Pattern>>;
    dispatch: Dispatch<ChangeTrackerAction<UndoRedoAction<PatternActions>>>;
} | null>(null);

import {
    createContext,
    Reducer,
    useCallback,
    useContext,
    useReducer,
} from "react";
import { wrapWithUndoRedoState, wrapWithUndoRedoReducer } from "./history";
import {
    wrapChangeTrackerState,
    wrapWithChangeTrackerReducer,
} from "./tracker";
import { PatternActions } from "../actions";
import { Pattern } from "../types";

export type PatternStore = ReturnType<typeof createPatterStore>;

export const PatternContext = createContext<PatternStore | null>(null);

export const createPatterStore = (
    reducer: Reducer<Pattern, PatternActions>,
    initialState: Pattern
) => {
    const [state, dispatch] = useReducer(
        wrapWithChangeTrackerReducer(wrapWithUndoRedoReducer(reducer)),
        wrapChangeTrackerState(wrapWithUndoRedoState(initialState))
    );

    return {
        state,
        dispatch,
    };
};

export const usePatternStore = () => {
    const { state, dispatch } = useContext(PatternContext)!;

    return {
        pattern: state.present,
        dispatch,
    };
};

export const usePatternHistory = () => {
    const { state, dispatch } = useContext(PatternContext)!;

    const undo = useCallback(() => {
        dispatch({ type: "UNDO" });
    }, [dispatch]);

    const redo = useCallback(() => {
        dispatch({ type: "REDO" });
    }, [dispatch]);

    const clear = useCallback(() => {
        dispatch({ type: "CLEAR" });
    }, [dispatch]);

    return {
        past: state.past,
        present: state.present,
        future: state.future,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        undo,
        redo,
        clear,
    };
};

export const usePatternChangeTracker = () => {
    const { state, dispatch } = useContext(PatternContext)!;

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, [dispatch]);

    return {
        changed: state.changed,
        reset,
    };
};

import { Reducer } from "react";

export type UndoRedoState<T> = {
    past: T[];
    present: T;
    future: T[];
    canUndo: boolean;
    canRedo: boolean;
};

export type UndoRedoOptions = {
    delayMilliseconds: number;
    maxHistoryLength: number;
};

const defaultOptions = {
    delayMilliseconds: 100,
    maxHistoryLength: 100,
};

export interface UndoRedoWithDebounceState<T> extends UndoRedoState<T> {
    lastSnapshotTime: number;
}

export type UndoRedoAction<TAction> =
    | TAction
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "CLEAR" };

export const createUndoRedoReducer = <TState, TAction extends object>(
    reducer: Reducer<TState, TAction>,
    options: UndoRedoOptions = defaultOptions
): Reducer<UndoRedoWithDebounceState<TState>, UndoRedoAction<TAction>> => {
    return function historyReducer(
        state: UndoRedoWithDebounceState<TState>,
        action: UndoRedoAction<TAction>
    ): UndoRedoWithDebounceState<TState> {
        if ("type" in action) {
            switch (action.type) {
                case "UNDO":
                    return state.past.length > 0
                        ? {
                              ...state,
                              past: state.past.slice(0, -1),
                              present: state.past[state.past.length - 1]!,
                              future: [state.present, ...state.future],
                              canUndo: state.past.length > 1,
                              canRedo: true,
                          }
                        : state;
                case "REDO":
                    return state.future.length > 0
                        ? {
                              ...state,
                              past: [...state.past, state.present],
                              present: state.future[0]!,
                              future: state.future.slice(1),
                              canUndo: true,
                              canRedo: state.future.length > 1,
                          }
                        : state;
                case "CLEAR":
                    return {
                        ...state,
                        past: [],
                        present: state.present,
                        future: [],
                        canUndo: false,
                        canRedo: false,
                    };
            }
        }

        const currentSnapshotTime = Date.now();
        const timeSinceLastSnapshot =
            currentSnapshotTime - state.lastSnapshotTime;

        if (timeSinceLastSnapshot > options.delayMilliseconds) {
            return {
                past: [...state.past, state.present],
                present: reducer(state.present, action),
                future: [],
                canUndo: true,
                canRedo: false,
                lastSnapshotTime: currentSnapshotTime,
            };
        }

        return {
            ...state,
            present: reducer(state.present, action),
            future: [],
        };
    };
};

export const createUndoRedoState = <T>(
    initialState: T
): UndoRedoWithDebounceState<T> => ({
    past: [],
    present: initialState,
    future: [],
    canUndo: false,
    canRedo: false,
    lastSnapshotTime: Date.now(),
});

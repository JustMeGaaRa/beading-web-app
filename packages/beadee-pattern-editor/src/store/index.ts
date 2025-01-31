import debounce from "just-debounce-it";
import { createContext, useContext } from "react";
import { create, useStore } from "zustand";
import { temporal } from "zundo";
import { DefaultPatternOptions, Pattern } from "../types";
import { PatternActions } from "../actions";
import { patternReducer } from "../reducers";
import { createPattern } from "../utils";
import { DefaultGridProperties } from "@beadee/grid-editor";
import Konva from "konva";

export const PatternContext = createContext<PatternTemporalStore | null>(null);

export type PatternStore = {
    patternNode?: Konva.Stage | null;
    pattern: Pattern;
    isDirty: boolean;
    resetDirty: () => void;
    dispatch: (action: PatternActions) => void;
};

export type PatternPartialStore = Omit<
    PatternStore,
    "patternNode" | "isDirty" | "resetDirty"
>;

export type PatternTemporalStore = ReturnType<typeof createPatterStore>;

export const createPatterStore = (pattern?: Pattern) => {
    return create(
        temporal<PatternStore>(
            (set) => ({
                pattern:
                    pattern ??
                    createPattern(DefaultPatternOptions, DefaultGridProperties),
                isDirty: false,
                resetDirty: () => set({ isDirty: false }),
                dispatch: (action) =>
                    set((state) => ({
                        pattern: patternReducer(state.pattern, action),
                        isDirty: true,
                    })),
            }),
            {
                limit: 100,
                partialize: (state: PatternStore) => {
                    const { isDirty, patternNode, ...rest } = state;
                    return rest as any;
                },
                handleSet: (handleSet) => debounce(handleSet, 200, true),
            }
        )
    );
};

export const usePatternStore = <U>(selector: (state: PatternStore) => U): U => {
    const store = useContext(PatternContext);
    return useStore(store!, selector);
};

export const usePatterHistory = () => {
    const store = useContext(PatternContext);
    return useStore(store!.temporal, (state) => state);
};

export const patternSelector = (state: PatternStore) => {
    const { pattern, dispatch } = state;
    return { pattern, dispatch };
};

export const dirtyStateSelector = (state: PatternStore) => {
    const { isDirty, resetDirty } = state;
    return { isDirty, resetDirty };
};

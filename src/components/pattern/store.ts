import debounce from "just-debounce-it";
import { createContext, useContext } from "react";
import { create, useStore } from "zustand";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";
import { createPattern } from "./utils";

export const PatternContext = createContext<PatternTemporalStore | null>(null);

export type PatternStore = {
    pattern: PatternState;
    isDirty: boolean;
    resetDirty: () => void;
    dispatch: (action: PatternActions) => void;
}

export type PatternTemporalStore = ReturnType<typeof createPatterStore>;

export const createPatterStore = (pattern?: PatternState) => {
    return create(
        temporal<PatternStore>((set) => ({
                pattern: pattern ?? createPattern("brick"),
                isDirty: false,
                resetDirty: () => set({ isDirty: false }),
                dispatch: (action) => set((state) => ({
                    pattern: patternReducer(state.pattern, action),
                    isDirty: true
                }))
            }), {
                limit: 100,
                partialize: (state) => {
                    const { isDirty, ...rest } = state;
                    return rest as any;
                },
                handleSet: (handleSet) => {
                    return debounce(handleSet, 200, true);
                }
            }
        )
    );
};

export const usePatternStore = <U>(selector: (state: PatternStore) => U): U => {
    const store = useContext(PatternContext);
    return useStore(store!, selector);
}

export const usePatterHistory = () => {
    const store = useContext(PatternContext);
    return useStore(store!.temporal, state => state)
};

export const patternSelector = (state: PatternStore) => {
    const { pattern, dispatch } = state;
    return { pattern, dispatch };
}

export const dirtyStateSelector = (state: PatternStore) => {
    const { isDirty, resetDirty } = state;
    return { isDirty, resetDirty };
}

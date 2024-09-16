import { create } from "zustand";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";
import { createPattern } from "./utils";
import debounce from "just-debounce-it";

export type PatternStore = {
    pattern: PatternState;
    isDirty: boolean;
    resetDirty: () => void;
    dispatch: (action: PatternActions) => void;
}

export const usePatternStore = create<PatternStore>()(
    temporal((set) => ({
            pattern: createPattern(),
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
                return rest;
            },
            handleSet: (handleSet) => {
                return debounce<typeof handleSet>(handleSet, 200, true);
            }
        }
    )
);

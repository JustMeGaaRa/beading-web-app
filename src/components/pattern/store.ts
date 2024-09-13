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

export const usePatternStore = create(
    temporal<PatternStore>((set) => ({
            pattern: createPattern(),
            isDirty: false,
            resetDirty: () => set({ isDirty: false }),
            dispatch: (action) => set((state) => ({
                pattern: patternReducer(state.pattern, action),
                isDirty: true
            }))
        }), {
            limit: 100,
            handleSet: (handleSet) => {
                const debounceSetter = debounce<typeof handleSet>(handleSet, 200, true);
                return debounceSetter;
            }
        }
    )
);

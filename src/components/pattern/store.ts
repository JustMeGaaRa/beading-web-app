import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";
import { createDefaultPattern } from "./utils";
import debounce from "just-debounce-it";

export type PatternStore = PatternState & {
    isDirty: boolean;
    resetDirty: () => void;
    dispatch: (action: PatternActions) => void;
}

export const usePatternStore = create(
    temporal(
        subscribeWithSelector<PatternStore>(
            (set) => ({
                ...createDefaultPattern(),
                isDirty: false,
                resetDirty: () => set({ isDirty: false }),
                dispatch: (action) => set((state) => ({ ...patternReducer(state, action), isDirty: true }))
            })
        ), {
            limit: 100,
            handleSet: (handleSet) => {
                const debounceSetter = debounce<typeof handleSet>(handleSet, 100, true);
                return debounceSetter;
            }
        }
    )
);

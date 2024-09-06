import { create } from "zustand";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";
import { createDefaultPattern } from "./utils";
import debounce from "just-debounce-it";

export type PatternStore = PatternState & {
    dispatch: (action: PatternActions) => void;
}

export const usePatternStore = create(
    temporal<PatternStore>((set) => ({
        ...createDefaultPattern(),
        dispatch: (action) => set((state) => patternReducer(state, action))
    }), {
        limit: 100,
        handleSet: (handleSet) => {
            const debounceSetter = debounce<typeof handleSet>(handleSet, 100, true);
            return debounceSetter;
        }
    })
);

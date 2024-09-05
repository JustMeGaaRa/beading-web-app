import { create } from "zustand";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";
import { createDefaultPattern } from "./utils";

export type PatternStore = PatternState & {
    dispatch: (action: PatternActions) => void;
}

export const usePatternStore = create(
    temporal<PatternStore>((set) => ({
        ...createDefaultPattern(),
        dispatch: (action) => set((state) => patternReducer(state, action))
    }), {
        limit: 100,
    })
);

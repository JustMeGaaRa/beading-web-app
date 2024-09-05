import { create } from "zustand";
import { temporal } from "zundo";
import { PatternState } from "./types";
import { DefaultPatternOptions } from "./constants";
import { PatternActions } from "./actions";
import { patternReducer } from "./reducers";

export type PatternStore = PatternState & {
    dispatch: (action: PatternActions) => void;
}

export const usePatternStore = create(
    temporal<PatternStore>((set) => ({
        name: "Untitled pattern",
        grids: [],
        options: DefaultPatternOptions,
        gridCount: 0,
        dispatch: (action) => set((state) => patternReducer(state, action))
    }), {
        limit: 100,
    })
);

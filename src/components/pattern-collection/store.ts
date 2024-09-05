import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PatternState } from "../pattern/types";
import { PatternCollectionActions } from "./actions";
import { patternCollectionReducer } from "./reducers";

export type PatternCollectionStore = {
    patterns: Array<PatternState>;
    dispatch: (action: PatternCollectionActions) => void;
}

export const usePatternCollectionStore = create(
    persist<PatternCollectionStore>((set) => ({
        patterns: [],
        dispatch: (action) => set((state) => patternCollectionReducer(state, action)),
    }), {
        name: "pattern-collection",
    })
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pattern } from "@beadee/pattern-editor";
import { PatternCollectionActions } from "./actions";
import { patternCollectionReducer } from "./reducers";

export type PatternCollectionStore = {
    patterns: Array<Pattern>;
    dispatch: (action: PatternCollectionActions) => void;
};

export const usePatternCollectionStore = create(
    persist<PatternCollectionStore>(
        (set) => ({
            patterns: [],
            dispatch: (action) =>
                set((state) => patternCollectionReducer(state, action)),
        }),
        {
            name: "pattern-collection",
        }
    )
);

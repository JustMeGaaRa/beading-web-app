import { SetStateAction } from "react";
import { create } from "zustand";
import { temporal } from "zundo";
import { PatternActions, PatternState } from "./types";
import { DefaultPatternOptions } from "./constants";

export const usePatternStore = create(
    temporal<PatternState & PatternActions>((set) => ({
        name: "Untitled pattern",
        grids: [],
        options: DefaultPatternOptions,
        gridCount: 0,
        setName: (name: SetStateAction<string>) => set(
            typeof name === "function"
                ? (state) => ({ name: name(state.name) })
                : { name }
        ),
        setOptions: (options) => set(
            typeof options === "function"
                ? (state) => ({ options: options(state.options) })
                : { options }
        ),
        setGrids: (grids) => set(
            typeof grids === "function"
                ? (state) => ({ grids: grids(state.grids) })
                : { grids }
        ),
        setGridCount: (gridCount) => set(
            typeof gridCount === "function"
                ? (state) => ({ gridCount: gridCount(state.gridCount) })
                : { gridCount }
        ),
    }))
);

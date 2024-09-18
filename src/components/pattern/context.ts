import { createContext, Dispatch, SetStateAction } from "react";
import { BeadingGridCell, BeadingGridState } from "../beading-grid";
import { DefaultPatternOptions } from "./constants";
import { PatternOptions } from "./types";

export const PatternContext = createContext<{
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
    setName: Dispatch<SetStateAction<string>>;
    setOptions: Dispatch<SetStateAction<PatternOptions>>;
    setGrids: Dispatch<SetStateAction<Array<BeadingGridState>>>;
    setGridCount: Dispatch<SetStateAction<number>>;
}>({
    name: "Untitled pattern",
    options: DefaultPatternOptions,
    grids: [],
    gridCount: 0,
    setName: () => {},
    setOptions: () => {},
    setGrids: () => {},
    setGridCount: () => {},
});

export const PatternSelectionContext = createContext<{
    selectedCells: Record<string, Array<BeadingGridCell>>;
    selectedColumn: number;
    selectedRow: number;
    setSelectedCells: Dispatch<SetStateAction<Record<string, Array<BeadingGridCell>>>>;
    setSelectedColumn: Dispatch<SetStateAction<number>>;
    setSelectedRow: Dispatch<SetStateAction<number>>;
}>({
    selectedCells: {},
    selectedColumn: -1,
    selectedRow: -1,
    setSelectedCells: () => {},
    setSelectedColumn: () => {},
    setSelectedRow: () => {},
});

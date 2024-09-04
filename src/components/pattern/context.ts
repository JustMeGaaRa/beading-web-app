import { createContext, SetStateAction } from "react";
import { DefaultPatternOptions } from "./constants";
import { BeadingGridState, PatternOptions } from "./types";

export const PatternContext = createContext<{
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
    setName: React.Dispatch<SetStateAction<string>>;
    setOptions: React.Dispatch<SetStateAction<PatternOptions>>;
    setGrids: React.Dispatch<SetStateAction<Array<BeadingGridState>>>;
    setGridCount: React.Dispatch<SetStateAction<number>>;
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

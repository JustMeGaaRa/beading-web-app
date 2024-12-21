import { createContext } from "react";
import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    DefaultGridProperties,
} from "../types";

export const BeadingGridContext = createContext<{
    cells: Array<BeadingGridCellState>;
    offset: BeadingGridOffset;
    options: BeadingGridProperties;
    setCells: (cells: Array<BeadingGridCellState>) => void;
    setOffset: (offset: BeadingGridOffset) => void;
    setOptions: (options: BeadingGridProperties) => void;
}>({
    cells: [],
    offset: { rowIndex: 0, columnIndex: 0 },
    options: DefaultGridProperties,
    setCells: () => {},
    setOffset: () => {},
    setOptions: () => {},
});

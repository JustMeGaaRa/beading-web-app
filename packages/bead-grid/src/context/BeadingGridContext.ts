import { createContext } from "react";
import {
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    DefaultGridProperties,
} from "../types";

export const BeadingGridContext = createContext<{
    gridId: string;
    name: string;
    cells: Array<BeadingGridCellState>;
    offset: BeadingGridOffset;
    options: BeadingGridProperties;
    setGridId: (gridId: string) => void;
    setName: (name: string) => void;
    setCells: (cells: Array<BeadingGridCellState>) => void;
    setOffset: (offset: BeadingGridOffset) => void;
    setOptions: (options: BeadingGridProperties) => void;
}>({
    gridId: "",
    name: "",
    cells: [],
    offset: { rowIndex: 0, columnIndex: 0 },
    options: DefaultGridProperties,
    setGridId: () => {},
    setName: () => {},
    setCells: () => {},
    setOffset: () => {},
    setOptions: () => {},
});

import { createContext } from "react";
import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
    DefaultGridProperties,
} from "../types";

export const BeadeeGridContext = createContext<{
    gridId: string;
    name: string;
    cells: Array<BeadingGridCell>;
    offset: BeadingGridOffset;
    options: BeadingGridProperties;
}>({
    gridId: "",
    name: "",
    cells: [],
    offset: { rowIndex: 0, columnIndex: 0 },
    options: DefaultGridProperties,
});

export const BeadeeGridOptionsContext = createContext<{
    options: BeadingGridProperties;
}>({
    options: DefaultGridProperties,
});

import { createContext } from "react";
import {
    BeadingGridOffset,
    BeadingGridProperties,
    DefaultGridProperties,
} from "../types";

export const BeadeeGridOptionsContext = createContext<{
    offset: BeadingGridOffset;
    options: BeadingGridProperties;
}>({
    offset: { rowIndex: 0, columnIndex: 0 },
    options: DefaultGridProperties,
});

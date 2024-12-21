import { createContext } from "react";
import { BeadingGridStyles, DefaultGridStyles } from "../types";

export const BeadingGridStylesContext = createContext<{
    styles: BeadingGridStyles;
}>({
    styles: DefaultGridStyles,
});

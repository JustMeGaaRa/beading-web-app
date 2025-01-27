import { createContext, Dispatch, SetStateAction } from "react";
import { BeadingGridStyles, DefaultGridStyles } from "../types";

export const BeadingGridStylesContext = createContext<{
    styles: BeadingGridStyles;
    setStyles: Dispatch<SetStateAction<BeadingGridStyles>>;
}>({
    styles: DefaultGridStyles,
    setStyles: () => {},
});

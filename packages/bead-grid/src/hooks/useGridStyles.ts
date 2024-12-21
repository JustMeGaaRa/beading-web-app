import { useContext } from "react";
import { BeadingGridStylesContext } from "../context";

export const useGridStyles = () => {
    return useContext(BeadingGridStylesContext);
};

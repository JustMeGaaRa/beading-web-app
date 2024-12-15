import { useContext } from "react";
import { PatternSelectionContext } from "./context";

export const usePatternSelection = () => {
    return useContext(PatternSelectionContext);
};

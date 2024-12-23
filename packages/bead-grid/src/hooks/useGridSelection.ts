import { useContext } from "react";
import { BeadingGridSelectionContext } from "../context";

export const useGridSelection = () => {
    return useContext(BeadingGridSelectionContext);
};

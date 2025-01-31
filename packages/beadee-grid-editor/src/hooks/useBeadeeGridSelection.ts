import { useContext } from "react";
import { BeadingGridSelectionContext } from "../context";

export const useBeadeeGridSelection = () => {
    return useContext(BeadingGridSelectionContext);
};

import { useContext } from "react";
import { BeadingGridSelectionContext } from "../context";

export const useBeadeeGridSelection = () => {
    const context = useContext(BeadingGridSelectionContext);

    if (!context) {
        throw new Error(
            "useBeadeeGridSelection must be used within a BeadeeGridSelectionProvider"
        );
    }

    return context;
};

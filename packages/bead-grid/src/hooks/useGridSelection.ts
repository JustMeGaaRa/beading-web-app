import { useContext } from "react";
import {
    BeadingGridSelectionContext,
    BeadingGridSelectionFrameContext,
} from "../context";

export const useGridSelection = () => {
    return useContext(BeadingGridSelectionContext);
};

export const useGridSelectionFrame = () => {
    return useContext(BeadingGridSelectionFrameContext);
};

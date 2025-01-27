import { useContext } from "react";
import { BeadeeRenderBoundsContext } from "../context";

export const useBeadeeRenderBounds = () => {
    return useContext(BeadeeRenderBoundsContext);
};

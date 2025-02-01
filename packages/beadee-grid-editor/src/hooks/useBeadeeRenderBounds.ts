import { useContext } from "react";
import { BeadeeRenderBoundsContext } from "../context";

export const useBeadeeRenderBounds = () => {
    const context = useContext(BeadeeRenderBoundsContext);

    if (!context) {
        throw new Error(
            "useBeadeeRenderBounds must be used within a BeadeeRenderBoundsProvider"
        );
    }

    return context;
};

import { createContext } from "react";
import { RenderPoint } from "../types";

export const BeadeeRenderBoundsContext = createContext<{
    position: RenderPoint;
    height: number;
    width: number;
}>({
    position: { x: 0, y: 0 },
    height: 0,
    width: 0,
});

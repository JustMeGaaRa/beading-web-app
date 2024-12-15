import { createContext } from "react";

export const GridOptionsContext = createContext<{
    cellHeight: number;
    cellWidth: number;
    pointPixelRatio: number;
}>({
    cellHeight: 0,
    cellWidth: 0,
    pointPixelRatio: 1,
});

import { FC, PropsWithChildren } from "react";
import { RenderPoint } from "../types";
import { BeadeeRenderBoundsContext } from "../context";

export const BeadeeRenderBoundsProvider: FC<
    PropsWithChildren<{
        position: RenderPoint;
        height: number;
        width: number;
    }>
> = ({ children, position, height, width }) => {
    return (
        <BeadeeRenderBoundsContext.Provider value={{ position, height, width }}>
            {children}
        </BeadeeRenderBoundsContext.Provider>
    );
};

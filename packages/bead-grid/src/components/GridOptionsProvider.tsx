import { FC, PropsWithChildren } from "react";
import { GridOptionsContext } from "../context";

export const GridOptionsProvider: FC<PropsWithChildren<{
    cellHeight: number;
    cellWidth: number;
    pointPixelRatio: number;
}>> = ({
    children, cellHeight, cellWidth, pointPixelRatio
}) => {
        return (
            <GridOptionsContext.Provider value={{ cellHeight, cellWidth, pointPixelRatio }}>
                {children}
            </GridOptionsContext.Provider>
        );
    };

import { FC, PropsWithChildren } from "react";
import { BeadeeGridContext } from "../context";
import { BeadingGrid } from "../types";

export const BeadeeGridProvider: FC<PropsWithChildren<BeadingGrid>> = ({
    children,
    gridId,
    name,
    cells,
    offset,
    options,
}) => {
    return (
        <BeadeeGridContext.Provider
            value={{
                gridId,
                name,
                cells,
                offset,
                options,
            }}
        >
            {children}
        </BeadeeGridContext.Provider>
    );
};

import { FC, PropsWithChildren } from "react";
import { BeadeeGridOptionsContext } from "../context";
import { BeadingGridOffset, BeadingGridProperties } from "../types";

export const BeadeeGridOptionsProvider: FC<
    PropsWithChildren<{
        offset: BeadingGridOffset;
        options: BeadingGridProperties;
    }>
> = ({ children, offset, options }) => {
    return (
        <BeadeeGridOptionsContext.Provider value={{ offset, options }}>
            {children}
        </BeadeeGridOptionsContext.Provider>
    );
};

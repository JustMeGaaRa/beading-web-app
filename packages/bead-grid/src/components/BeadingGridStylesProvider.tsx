import { FC, PropsWithChildren } from "react";
import { BeadingGridStylesContext } from "../context";
import { BeadingGridStyles } from "../types";

export const BeadingGridStylesProvider: FC<PropsWithChildren<{
    styles: BeadingGridStyles;
}>> = ({
    children,
    styles
}) => {
        return (
            <BeadingGridStylesContext.Provider value={{ styles }}>
                {children}
            </BeadingGridStylesContext.Provider>
        );
    };
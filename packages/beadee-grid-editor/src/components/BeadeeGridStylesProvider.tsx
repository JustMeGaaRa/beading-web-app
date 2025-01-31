import { FC, PropsWithChildren, useEffect, useState } from "react";
import { BeadingGridStylesContext } from "../context";
import { BeadingGridStyles, DefaultGridStyles } from "../types";

export const BeadeeGridStylesProvider: FC<
    PropsWithChildren<{
        styles: BeadingGridStyles;
    }>
> = ({ children, styles: stylesProps }) => {
    const [styles, setStyles] = useState(DefaultGridStyles);

    useEffect(() => setStyles(stylesProps), [stylesProps]);

    return (
        <BeadingGridStylesContext.Provider value={{ styles, setStyles }}>
            {children}
        </BeadingGridStylesContext.Provider>
    );
};

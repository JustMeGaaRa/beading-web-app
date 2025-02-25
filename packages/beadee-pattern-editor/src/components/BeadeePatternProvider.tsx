import { DefaultGridProperties } from "@beadee/grid-editor";
import { FC, PropsWithChildren } from "react";
import { useBeadeePatternReducer } from "../hooks";
import { BeadeePatternContext } from "../context";
import { DefaultPatternOptions, Pattern } from "../types";
import { createPattern } from "../utils";

export const BeadeePatternProvider: FC<
    PropsWithChildren<{
        pattern?: Pattern;
    }>
> = ({ children, pattern }) => {
    const [state, dispatch] = useBeadeePatternReducer(
        pattern ?? createPattern(DefaultPatternOptions, DefaultGridProperties)
    );

    return (
        <BeadeePatternContext.Provider value={{ state, dispatch }}>
            {children}
        </BeadeePatternContext.Provider>
    );
};

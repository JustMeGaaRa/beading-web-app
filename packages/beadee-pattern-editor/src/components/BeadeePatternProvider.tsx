import { FC, PropsWithChildren, useRef } from "react";
import { PatternContext, PatternStore, createPatterStore } from "../store";
import { DefaultPatternOptions, Pattern } from "../types";
import { patternReducer } from "../reducers";
import { createPattern } from "../utils";
import { DefaultGridProperties } from "@beadee/grid-editor";

export const BeadeePatternProvider: FC<
    PropsWithChildren<{
        pattern?: Pattern;
    }>
> = ({ children, pattern }) => {
    const storeRef = useRef<PatternStore>();

    if (!storeRef.current) {
        storeRef.current = createPatterStore(
            patternReducer,
            pattern ??
                createPattern(DefaultPatternOptions, DefaultGridProperties)
        );
    }

    return (
        storeRef.current && (
            <PatternContext.Provider value={storeRef.current}>
                {children}
            </PatternContext.Provider>
        )
    );
};

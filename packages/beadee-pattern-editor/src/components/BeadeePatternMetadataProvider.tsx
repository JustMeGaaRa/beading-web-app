import { FC, PropsWithChildren } from "react";
import { BeadeePatternMetadataContext } from "../context";
import { PatternMetadata } from "../types";

export const BeadeePatternMetadataProvider: FC<
    PropsWithChildren<{
        metadata: PatternMetadata;
    }>
> = ({ children, metadata }) => {
    return (
        <BeadeePatternMetadataContext.Provider value={{ metadata }}>
            {children}
        </BeadeePatternMetadataContext.Provider>
    );
};

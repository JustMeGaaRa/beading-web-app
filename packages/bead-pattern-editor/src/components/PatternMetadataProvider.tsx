import { FC, PropsWithChildren } from "react";
import { PatternMetadataContext } from "../context";
import { PatternMetadata } from "../types";

export const PatternMetadataProvider: FC<
    PropsWithChildren<{
        metadata: PatternMetadata;
    }>
> = ({ children, metadata }) => {
    return (
        <PatternMetadataContext.Provider value={{ metadata }}>
            {children}
        </PatternMetadataContext.Provider>
    );
};

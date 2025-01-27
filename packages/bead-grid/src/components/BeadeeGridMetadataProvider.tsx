import { FC, PropsWithChildren } from "react";
import { BeadeeGridMetadataContext } from "../context";
import { BeadingGridMetadata } from "../types";

export const BeadeeGridMetadataProvider: FC<
    PropsWithChildren<{
        metadata?: BeadingGridMetadata;
    }>
> = ({ children, metadata }) => {
    return (
        <BeadeeGridMetadataContext.Provider value={{ metadata }}>
            {children}
        </BeadeeGridMetadataContext.Provider>
    );
};

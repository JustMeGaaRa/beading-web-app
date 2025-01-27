import { createContext } from "react";
import { BeadingGridMetadata } from "../types";

export const BeadeeGridMetadataContext = createContext<{
    metadata?: BeadingGridMetadata;
}>({});

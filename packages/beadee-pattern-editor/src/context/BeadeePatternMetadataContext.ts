import { createContext } from "react";
import { PatternMetadata } from "../types";

export const BeadeePatternMetadataContext = createContext<{
    metadata?: PatternMetadata;
}>({});

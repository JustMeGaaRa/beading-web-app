import { createContext } from "react";
import { PatternMetadata } from "../types";

export const PatternMetadataContext = createContext<{
    metadata?: PatternMetadata;
}>({});

import { useContext } from "react";
import { PatternMetadataContext } from "../context";

export const usePatternMetadata = () => {
    return useContext(PatternMetadataContext);
};

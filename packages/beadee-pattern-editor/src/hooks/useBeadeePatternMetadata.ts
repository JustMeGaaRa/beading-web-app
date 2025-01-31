import { useContext } from "react";
import { BeadeePatternMetadataContext } from "../context";

export const useBeadeePatternMetadata = () => {
    return useContext(BeadeePatternMetadataContext);
};

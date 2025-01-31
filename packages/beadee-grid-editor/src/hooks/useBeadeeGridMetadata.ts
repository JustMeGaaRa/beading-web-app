import { useContext } from "react";
import { BeadeeGridMetadataContext } from "../context";

export const useBeadeeGridMetadata = () => {
    return useContext(BeadeeGridMetadataContext);
};

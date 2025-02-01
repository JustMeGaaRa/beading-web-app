import { useContext } from "react";
import { BeadeeGridOptionsContext } from "../context";

export const useBeadeeGridOptions = () => {
    const context = useContext(BeadeeGridOptionsContext);

    if (!context) {
        throw new Error(
            "useBeadeeGridOptions must be used within a BeadeeGridOptionsProvider"
        );
    }

    return context;
};

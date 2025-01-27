import { useContext } from "react";
import { BeadingGridStylesContext } from "../context";

export const useBeadeeGridStyles = () => {
    return useContext(BeadingGridStylesContext);
};

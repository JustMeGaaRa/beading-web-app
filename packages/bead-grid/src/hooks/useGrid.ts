import { useContext } from "react";
import { BeadingGridContext } from "../context";

export const useGrid = () => {
    return useContext(BeadingGridContext);
};

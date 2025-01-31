import { useContext } from "react";
import { BeadeeGridContext, BeadeeGridOptionsContext } from "../context";

export const useBeadeeGrid = () => {
    return useContext(BeadeeGridContext);
};

export const useBeadeeGridOptions = () => {
    return useContext(BeadeeGridOptionsContext);
};

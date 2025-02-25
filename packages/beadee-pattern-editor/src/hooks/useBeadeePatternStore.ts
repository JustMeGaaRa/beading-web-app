import { useContext } from "react";
import { BeadeePatternContext } from "../context";

export const useBeadeePatternStore = () => {
    const { state, dispatch } = useContext(BeadeePatternContext)!;

    return {
        pattern: state.present,
        dispatch,
    };
};

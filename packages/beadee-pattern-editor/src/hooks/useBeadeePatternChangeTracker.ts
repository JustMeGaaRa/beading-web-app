import { useCallback, useContext } from "react";
import { BeadeePatternContext } from "../context";

export const useBeadeePatternChangeTracker = () => {
    const { state, dispatch } = useContext(BeadeePatternContext)!;

    const reset = useCallback(() => dispatch({ type: "RESET" }), [dispatch]);

    return {
        changed: state.changed,
        reset,
    };
};

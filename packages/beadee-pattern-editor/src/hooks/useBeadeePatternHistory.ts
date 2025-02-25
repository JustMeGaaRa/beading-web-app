import { useCallback, useContext } from "react";
import { BeadeePatternContext } from "../context";

export const useBeadeePatternHistory = () => {
    const { state, dispatch } = useContext(BeadeePatternContext)!;

    const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
    const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);
    const clear = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch]);

    return {
        past: state.past,
        present: state.present,
        future: state.future,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        undo,
        redo,
        clear,
    };
};

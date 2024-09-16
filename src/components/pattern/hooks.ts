import { useContext } from "react";
import { useStore } from "zustand";
import { PatternSelectionContext } from "./context";
import { usePatternStore } from "./store";

export const usePatternSelection = () => {
    return useContext(PatternSelectionContext);
};

export const usePatterHistory = () => {
    const {
        pastStates,
        futureStates,
        undo,
        redo
    } = useStore(
        usePatternStore.temporal,
        state => state
    );

    return {
        pastStates,
        futureStates,
        undo,
        redo
    }
};
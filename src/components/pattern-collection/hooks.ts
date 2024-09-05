import { useCallback } from "react";
import { PatternState } from "../pattern";
import { usePatternCollectionStore } from "./store";

export const usePatternCollection = () => {
    const {
        patterns,
        dispatch
    } = usePatternCollectionStore();

    const addPattern = useCallback((pattern: PatternState) => {
        dispatch({ type: "addPattern", payload: { pattern } });
    }, [dispatch]);

    const deletePattern = useCallback((patternId: string) => {
        dispatch({ type: "deletePattern", payload: { patternId } });
    }, [dispatch]);

    const savePattern = useCallback((pattern: PatternState) => {
        dispatch({ type: "savePattern", payload: { pattern } });
    }, [dispatch]);

    return {
        patterns,
        addPattern,
        deletePattern,
        savePattern
    };
};

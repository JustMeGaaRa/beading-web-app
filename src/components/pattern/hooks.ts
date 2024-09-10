import { useCallback } from "react";
import { usePatternStore } from "./store";
import {
    BeadingGridCellState,
    BeadingGridProperties,
    PatternOptions,
    PatternState,
} from "./types";
import { useStore } from "zustand";

export const usePattern = () => {
    const { pattern, dispatch } = usePatternStore();

    const setPattern = useCallback((pattern: PatternState) => {
        dispatch({ type: "setPattern", payload: { pattern } });
    }, [dispatch]);

    const setPatternName = useCallback((name: string) => {
        dispatch({ type: "setPatternName", payload: { name } });
    }, [dispatch]);

    const setPatternCover = useCallback((coverUrl: string) => {
        dispatch({ type: "setPatternCover", payload: { coverUrl } });
    }, [dispatch]);

    const changePatternColor = useCallback((oldColor: string, newColor: string) => {
        dispatch({ type: "changePatternColor", payload: { oldColor, newColor } });
    }, [dispatch]);

    const setGridCellColor = useCallback((name: string, cell: BeadingGridCellState) => {
        dispatch({ type: "setGridCellColor", payload: { name, cell } });
    }, [dispatch]);
    
    const addGrid = useCallback(() => {
        dispatch({ type: "addGrid", payload: {} });
    }, [dispatch]);
    
    const deleteGrid = useCallback((name: string) => {
        dispatch({ type: "deleteGrid", payload: { name } });
    }, [dispatch]);

    const applyPatternOptions = useCallback((options: PatternOptions) => {
        dispatch({ type: "applyPatternOptions", payload: { options } });
    }, [dispatch]);

    const applyGridOptions = useCallback((name: string, options: BeadingGridProperties) => {
        dispatch({ type: "applyGridOptions", payload: { name, options } });
    }, [dispatch]);

    const addGridColumnLeft = useCallback((name: string, column: number) => {
        dispatch({ type: "addGridColumnLeft", payload: { name, column } });
    }, [dispatch]);

    const addGridColumnRight = useCallback((name: string, column: number) => {
        dispatch({ type: "addGridColumnRight", payload: { name, column } });
    }, [dispatch]);

    const deleteGridColumn = useCallback((name: string, column: number) => {
        dispatch({ type: "deleteGridColumn", payload: { name, column } });
    }, [dispatch]);

    const clearGridColumn = useCallback((name: string, column: number) => {
        dispatch({ type: "clearGridColumn", payload: { name, column } });
    }, [dispatch]);

    const addGridRowAbove = useCallback((name: string, row: number) => {
        dispatch({ type: "addGridRowAbove", payload: { name, row } });
    }, [dispatch]);

    const addGridRowBelow = useCallback((name: string, row: number) => {
        dispatch({ type: "addGridRowBelow", payload: { name, row } });
    }, [dispatch]);

    const deleteGridRow = useCallback((name: string, row: number) => {
        dispatch({ type: "deleteGridRow", payload: { name, row } });
    }, [dispatch]);

    const clearGridRow = useCallback((name: string, row: number) => {
        dispatch({ type: "clearGridRow", payload: { name, row } });
    }, [dispatch]);

    return {
        pattern,
        setPatternName,
        setPatternCover,
        changePatternColor,
        setGridCellColor,
        addGrid,
        deleteGrid,
        setPattern,
        applyPatternOptions,
        applyGridOptions,
        addGridColumnLeft,
        addGridColumnRight,
        deleteGridColumn,
        clearGridColumn,
        addGridRowAbove,
        addGridRowBelow,
        deleteGridRow,
        clearGridRow,
    };
};

export const usePatterHistory = () => {
    return useStore(usePatternStore.temporal, state => state);
};
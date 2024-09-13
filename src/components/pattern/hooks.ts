import { useCallback, useContext } from "react";
import { PatternSelectionContext } from "./context";
import { usePatternStore } from "./store";
import { PatternOptions, PatternState } from "./types";
import { BeadingGridCellState, BeadingGridProperties, GridCellPosition, GridSection } from "../beading-grid";
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

    const setGridCell = useCallback((name: string, cell: BeadingGridCellState) => {
        dispatch({ type: "setGridCell", payload: { name, cell } });
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

    const clearGridCells = useCallback((name: string, cells: Array<BeadingGridCellState>) => {
        dispatch({ type: "clearGridCells", payload: { name, cells } });
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

    const setGridSection = useCallback((name: string, section: GridSection, cellPosition: GridCellPosition) => {
        dispatch({ type: "setGridSection", payload: { name, section, cellPosition } });
    }, [dispatch]);

    return {
        pattern,
        setPatternName,
        setPatternCover,
        changePatternColor,
        setGridCell,
        addGrid,
        deleteGrid,
        setPattern,
        applyPatternOptions,
        applyGridOptions,
        clearGridCells,
        addGridColumnLeft,
        addGridColumnRight,
        deleteGridColumn,
        clearGridColumn,
        addGridRowAbove,
        addGridRowBelow,
        deleteGridRow,
        clearGridRow,
        setGridSection
    };
};

export const usePatternSelection = () => {
    return useContext(PatternSelectionContext);
};

export const usePatterHistory = () => {
    return useStore(usePatternStore.temporal, state => state);
};
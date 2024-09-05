import { useCallback } from "react";
import { usePatternStore } from "./store";
import { BeadingGridCellState, BeadingGridProperties, BeadSize, PatternOptions, PatternSummary } from "./types";
import { isNullOrEmpty } from "./utils";
import { useStore } from "zustand";

export const usePattern = () => {
    const {
        name,
        grids,
        options,
        dispatch
    } = usePatternStore();

    const setPatternName = useCallback((name: string) => {
        dispatch({ type: "setName", payload: { name } });
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

    const resetGrids = useCallback(() => {
        dispatch({ type: "resetPattern", payload: {} });
    }, [dispatch]);

    const applyPatternOptions = useCallback((options: PatternOptions) => {
        dispatch({ type: "applyPatternOptions", payload: { options } });
    }, [dispatch]);

    const applyGridOptions = useCallback((name: string, options: BeadingGridProperties) => {
        dispatch({ type: "applyGridOptions", payload: { name, options } });
    }, [dispatch]);

    const getSummary = useCallback((): PatternSummary => {
        const beadItems = new Map<string, number>();
        grids.forEach((gridState) => {
            gridState.rows.forEach((rowState) => {
                rowState.cells
                    .filter((cell) => !isNullOrEmpty(cell))
                    .forEach((cell) =>
                        beadItems.set(cell, (beadItems.get(cell) || 0) + 1)
                    );
            });
        });
        const beads = Array.from(beadItems.keys()).map((key) => ({
            color: key,
            colorName: key,
            number: beadItems.get(key) || 0,
        }));
        const totalBeads = grids.reduce((patternTotal, gridState) => {
            const gridTotal = gridState.rows.reduce((gridTotal, rowState) => {
                const rowTotal = rowState.cells.filter((cell) => !isNullOrEmpty(cell)).length;
                return gridTotal + rowTotal;
            }, 0);
            return patternTotal + gridTotal;
        }, 0);
        const totalHeight =
        options.layout.orientation === "vertical"
            ? grids
                .reduce((totalHeight, gridState) =>
                    totalHeight + gridState.options.height * options.layout.beadSize.height,
                    0
                )
            : grids
                .map((gridState) => gridState.rows.length)
                .reduce((max, height) =>
                    max > height ? max : height * options.layout.beadSize.height,
                    0
                );
        const totalWidth =
        options.layout.orientation === "vertical"
            ? options.layout.width
            : options.layout.width * grids.length * options.layout.beadSize.width;
        const totalSize: BeadSize = {
            title: `${totalHeight.toFixed(2)} x ${totalWidth.toFixed(2)} mm`,
            height: totalHeight,
            width: totalWidth,
        };

        return {
            totalBeads,
            beadSize: options.layout.beadSize,
            totalSize,
            beads,
        };
    }, [grids, options]);

    return {
        name,
        grids,
        options,
        setPatternName,
        setGridCellColor,
        addGrid,
        deleteGrid,
        resetGrids,
        applyPatternOptions,
        applyGridOptions,
        getSummary,
    };
};

export const usePatterHistory = () => {
    return useStore(usePatternStore.temporal, state => state);
};
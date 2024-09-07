import { useCallback } from "react";
import { usePatternStore } from "./store";
import {
    BeadingGridCellState,
    BeadingGridProperties,
    BeadSize,
    PatternOptions,
    PatternState,
    PatternSummary
} from "./types";
import { isNullOrEmpty } from "./utils";
import { useStore } from "zustand";

export const usePattern = () => {
    const {
        patternId,
        lastModified,
        coverUrl,
        name,
        grids,
        options,
        gridCount,
        dispatch
    } = usePatternStore();

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

    const getPattern = useCallback((): PatternState => {
        return {
            patternId,
            name,
            lastModified,
            coverUrl,
            options,
            grids,
            gridCount,
        }
    }, [patternId, name, lastModified, coverUrl, options, grids, gridCount]);

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
        setPatternCover,
        changePatternColor,
        setGridCellColor,
        addGrid,
        deleteGrid,
        setPattern,
        applyPatternOptions,
        applyGridOptions,
        getPattern,
        getSummary,
    };
};

export const usePatterHistory = () => {
    return useStore(usePatternStore.temporal, state => state);
};
import { useCallback } from "react";
import { usePatternStore } from "./store";
import { BeadingGridType, BeadSize, PatternSummary } from "./types";
import { createBeadingGrid, isNullOrEmpty } from "./utils";
import { useStore } from "zustand";

export const usePattern = () => {
    const {
        name,
        grids,
        options,
        gridCount,
        setName,
        setGrids,
        setOptions,
        setGridCount,
    } = usePatternStore();

    const resetGrids = useCallback((type: BeadingGridType) => {
        const grid = createBeadingGrid(
            "Grid 1",
            {
                type: type,
                height: 10,
                width: 10,
                drop: 1,
                fringe: 0,
            },
            options
        );
        setGrids([grid]);
        setGridCount(1);
    }, [gridCount, setGrids, setGridCount]);

    const addGrid = useCallback((type: BeadingGridType) => {
        const grid = createBeadingGrid(
            `Grid ${gridCount + 1}`,
            {
                type: type,
                height: 10,
                width: 10,
                drop: 1,
                fringe: 0,
            },
            options
        );
        setGrids((grids) => [...grids, grid]);
        setGridCount((count) => count + 1);
    }, [gridCount, options, setGrids, setGridCount]);

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
        setName,
        setGrids,
        setOptions,
        addGrid,
        resetGrids,
        getSummary,
    };
};

export const usePatterHistory = () => {
    return useStore(usePatternStore.temporal, state => state);
};
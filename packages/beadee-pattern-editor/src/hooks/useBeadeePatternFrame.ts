import { useCallback } from "react";
import { patternSelector, usePatternStore } from "../store";
import { getGridColumnIndex, getGridRowIndex } from "../utils";

export const useBeadeePatternFrame = () => {
    const { pattern, dispatch } = usePatternStore(patternSelector);

    const insertRow = useCallback(
        (patternRowIndex: number) => {
            const relativeIndex = getGridRowIndex(
                pattern.grids,
                patternRowIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_INSERT_ROW",
                    gridId:
                        pattern.options.orientation === "horizontal"
                            ? "all"
                            : relativeIndex.gridId,
                    row: relativeIndex.rowIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    const clearRow = useCallback(
        (patternRowIndex: number) => {
            const relativeIndex = getGridRowIndex(
                pattern.grids,
                patternRowIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_CLEAR_ROW",
                    gridId:
                        pattern.options.orientation === "horizontal"
                            ? "all"
                            : relativeIndex.gridId,
                    row: relativeIndex.rowIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    const deleteRow = useCallback(
        (patternRowIndex: number) => {
            const relativeIndex = getGridRowIndex(
                pattern.grids,
                patternRowIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_DELETE_ROW",
                    gridId: pattern.options.orientation
                        ? "all"
                        : relativeIndex.gridId,
                    row: relativeIndex.rowIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    const insertColumn = useCallback(
        (patternColumnIndex: number) => {
            const relativeIndex = getGridColumnIndex(
                pattern.grids,
                patternColumnIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_INSERT_COLUMN",
                    gridId:
                        pattern.options.orientation === "horizontal"
                            ? relativeIndex.gridId
                            : "all",
                    column: relativeIndex.columnIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    const clearColumn = useCallback(
        (patternColumnIndex: number) => {
            const relativeIndex = getGridColumnIndex(
                pattern.grids,
                patternColumnIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_CLEAR_COLUMN",
                    gridId:
                        pattern.options.orientation === "horizontal"
                            ? relativeIndex.gridId
                            : "all",
                    column: relativeIndex.columnIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    const deleteColumn = useCallback(
        (patternColumnIndex: number) => {
            const relativeIndex = getGridColumnIndex(
                pattern.grids,
                patternColumnIndex
            );
            if (relativeIndex) {
                dispatch({
                    type: "BEADING_GRID_DELETE_COLUMN",
                    gridId:
                        pattern.options.orientation === "horizontal"
                            ? relativeIndex.gridId
                            : "all",
                    column: relativeIndex.columnIndex,
                });
            }
        },
        [pattern.grids, pattern.options, dispatch]
    );

    return {
        insertRow,
        clearRow,
        deleteRow,
        insertColumn,
        clearColumn,
        deleteColumn,
    };
};

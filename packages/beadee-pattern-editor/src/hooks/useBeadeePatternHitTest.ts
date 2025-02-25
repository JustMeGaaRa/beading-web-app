import {
    RenderBounds,
    RenderPoint,
    useBeadeeGridStyles,
} from "@beadee/grid-editor";
import { useCallback } from "react";
import { useBeadeePatternStore } from "../hooks";
import { getCellAtPatternPosition, getCellsInPatternBounds } from "../utils";

export const useBeadeePatternHitTest = () => {
    const { pattern } = useBeadeePatternStore();
    const { styles } = useBeadeeGridStyles();

    const getCellAtPosition = useCallback(
        (position: RenderPoint) => {
            const currentCell = getCellAtPatternPosition(
                pattern.grids,
                styles,
                position
            );
            return currentCell;
        },
        [pattern.grids, styles]
    );

    const getCellsInBounds = useCallback(
        (bounds: RenderBounds) => {
            const currentSelectedCells = getCellsInPatternBounds(
                pattern.grids,
                styles,
                bounds
            );
            return currentSelectedCells;
        },
        [pattern.grids, styles]
    );

    return { getCellAtPosition, getCellsInBounds };
};

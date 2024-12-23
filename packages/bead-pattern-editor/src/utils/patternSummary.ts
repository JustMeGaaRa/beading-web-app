import { BeadingGridState, flipBead } from "@repo/bead-grid";
import { PatternOptions, PatternSummary } from "../types";
import { getPatternSize } from "./pattern";

export const getPatternSummary = (
    grids: Array<BeadingGridState>,
    patternOptions: PatternOptions
): PatternSummary => {
    const beadItems = new Map<string, number>();

    grids.forEach((gridState) =>
        gridState.cells.forEach((cell) =>
            beadItems.set(cell.color, (beadItems.get(cell.color) || 0) + 1)
        )
    );

    const beads = Array.from(beadItems.keys()).map((color) => ({
        color: color,
        colorName: color,
        number: beadItems.get(color) || 0,
    }));

    const totalBeads = grids.reduce(
        (patternTotal, gridState) => patternTotal + gridState.cells.length,
        0
    );
    const totalSize = getPatternRealSize(grids, patternOptions);

    return {
        totalBeads,
        totalSize,
        beadSize: patternOptions.layout.beadSize,
        beads,
    };
};

export const getPatternRealSize = (
    grids: Array<BeadingGridState>,
    patternOptions: PatternOptions
) => {
    const patternSize = getPatternSize(grids, patternOptions);
    const beadSize =
        patternOptions.layout.type === "brick"
            ? flipBead(patternOptions.layout.beadSize)
            : patternOptions.layout.beadSize;

    return {
        height: patternSize.height * beadSize.height,
        width: patternSize.width * beadSize.width,
    };
};

export const formatPatternSize = (size: { height: number; width: number }) => {
    return `${size.height.toFixed(2)} x ${size.width.toFixed(2)} mm`;
};

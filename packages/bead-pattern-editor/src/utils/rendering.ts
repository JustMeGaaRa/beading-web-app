import { BeadingGridState, BeadingGridStyles } from "@repo/bead-grid";
import { PatternOptions } from "../types";
import { getPatternRealSize } from "./patternSummary";

export const getPatternRenderSize = (
    grids: Array<BeadingGridState>,
    gridStyles: BeadingGridStyles,
    patternOptions: PatternOptions
) => {
    const patternSize = getPatternRealSize(grids, patternOptions);

    return {
        height: patternSize.height * gridStyles.rendering.pixelPerPoint,
        width: patternSize.width * gridStyles.rendering.pixelPerPoint,
    };
};

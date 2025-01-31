import {
    BeadingGrid,
    BeadingGridStyles,
    combineRenderBounds,
    getGridMetadata,
    getGridRenderBounds,
    RenderBounds,
} from "@beadee/grid-editor";
import { PatternMetadata } from "../types";

export const getPatternMetadata = (
    grids: Array<BeadingGrid>,
    styles: BeadingGridStyles
): PatternMetadata => {
    return {
        patternBounds: getPatternRenderBounds(grids, styles),
        gridsMetadata: grids.reduce((map, grid) => {
            return map.set(grid.gridId, getGridMetadata(grid, styles));
        }, new Map()),
    };
};

export const getPatternRenderBounds = (
    grids: Array<BeadingGrid>,
    styles: BeadingGridStyles
): RenderBounds => {
    const patternBounds = combineRenderBounds(
        grids.map((grid) =>
            getGridRenderBounds(grid.offset, grid.options, styles)
        )
    );
    return patternBounds;
};

export type PatternMetadataCache = ReturnType<typeof createPatternMetadata>;

export const createPatternMetadata = (
    grids: Array<BeadingGrid>,
    styles: BeadingGridStyles
) => {
    let paternRenderBounds: RenderBounds;
    const gridRenderBounds = new Map<string, RenderBounds>();

    const getPatternBounds = (): RenderBounds => {
        if (!paternRenderBounds) {
            paternRenderBounds = getPatternRenderBounds(grids, styles);
        }
        return paternRenderBounds;
    };

    const getGridBounds = (grid: BeadingGrid): RenderBounds => {
        if (!gridRenderBounds.has(grid.gridId)) {
            const renderBounds = getGridRenderBounds(
                grid.offset,
                grid.options,
                styles
            );
            gridRenderBounds.set(grid.gridId, renderBounds);
        }
        return gridRenderBounds.get(grid.gridId)!;
    };

    return {
        getPatternBounds,
        getGridBounds,
    };
};

import {
    BeadingGrid,
    BeadingGridCell,
    BeadingGridStyles,
    getCellAtPosition,
    getCellsInBounds,
    RenderBounds,
    RenderPoint,
} from "@repo/bead-grid";

export const getCellAtPatternPosition = (
    grids: Array<BeadingGrid>,
    styles: BeadingGridStyles,
    position: RenderPoint
): Record<string, Array<BeadingGridCell>> => {
    const currentSelectedCells = grids.reduce(
        (selected, grid) => {
            const mousePositionCell = getCellAtPosition(grid, styles, position);
            if (mousePositionCell.successfull) {
                return {
                    ...selected,
                    [grid.gridId]: mousePositionCell.hits,
                };
            }

            return selected;
        },
        {} as Record<string, Array<BeadingGridCell>>
    );
    return currentSelectedCells;
};

export const getCellsInPatternBounds = (
    grids: Array<BeadingGrid>,
    styles: BeadingGridStyles,
    bounds: RenderBounds
): Record<string, Array<BeadingGridCell>> => {
    const currentSelectedCells = grids.reduce(
        (selected, grid) => {
            const boundsCells = getCellsInBounds(grid, styles, bounds);
            if (boundsCells.successfull) {
                return {
                    ...selected,
                    [grid.gridId]: boundsCells.hits,
                };
            }

            return selected;
        },
        {} as Record<string, Array<BeadingGridCell>>
    );
    return currentSelectedCells;
};

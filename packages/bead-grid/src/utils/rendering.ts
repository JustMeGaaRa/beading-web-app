import {
    RenderBounds,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridStyles,
    BeadingGridType,
    BeadProperties,
    BrickGridProperties,
    BeadingGridSize,
    BeadingGridSectionState,
} from "../types";
import { flipBead } from "./common";
import { getGridSize } from "./grid";

export const getGridCellRenderSize = (
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): BeadingGridSize => {
    const getGridCellSize = (
        type: BeadingGridType,
        pixelPerPoint: number,
        bead: BeadProperties
    ) => {
        const beadSize = type === "brick" ? flipBead(bead) : bead;
        const height = beadSize.height * pixelPerPoint;
        const width = beadSize.width * pixelPerPoint;

        return { height, width };
    };

    return getGridCellSize(
        options.type,
        styles.rendering.pixelPerPoint,
        styles.bead
    );
};

export const getGridCellRenderBounds = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const { height, width } = getGridCellRenderSize(options, styles);

    const cellStaggerX = width / 2;
    const cellStaggerY = height / 2;

    const getBrickCellOffset = (
        offset: BeadingGridOffset,
        options: BrickGridProperties
    ) => {
        const getBrickOffsetX = (
            index: number,
            height: number,
            drop: number
        ) => {
            const dropOffsetNormal = Math.floor(index / drop) % 2;
            const fringeOffsetNormal = index > height ? 0 : 1;
            return cellStaggerX * dropOffsetNormal * fringeOffsetNormal;
        };

        const { columnIndex, rowIndex } = offset;
        const brickOffsetX = getBrickOffsetX(
            rowIndex,
            options.height - 1,
            options.drop
        );

        return {
            x: width * columnIndex + brickOffsetX,
            y: height * rowIndex,
            height: height,
            width: width,
        };
    };

    const getPeyoteCellOffset = (offset: BeadingGridOffset) => {
        const getPeyoteOffsetY = (index: number) => {
            const columnOffsetNormal = index % 2;
            return cellStaggerY * columnOffsetNormal;
        };

        const { columnIndex, rowIndex } = offset;
        const peyoteOffsetY = getPeyoteOffsetY(columnIndex);

        return {
            x: width * columnIndex,
            y: height * rowIndex + peyoteOffsetY,
            height: height,
            width: width,
        };
    };

    const getSquaredCellOffset = (offset: BeadingGridOffset) => {
        const { columnIndex, rowIndex } = offset;

        return {
            x: width * columnIndex,
            y: height * rowIndex,
            height: height,
            width: width,
        };
    };

    return options.type === "brick"
        ? getBrickCellOffset(offset, options)
        : options.type === "peyote"
          ? getPeyoteCellOffset(offset)
          : getSquaredCellOffset(offset);
};

export const getGridSectionRenderBounds = (
    bounds: BeadingGridSectionState,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const cellBounds = getGridCellRenderBounds(bounds.topLeft, options, styles);
    const topLeftBounds = getGridCellRenderBounds(
        bounds.topLeft,
        options,
        styles
    );

    return {
        x: topLeftBounds.x,
        y: topLeftBounds.y,
        height: cellBounds.height * bounds.height,
        width: cellBounds.width * bounds.width,
    };
};

export const getGridRenderBounds = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const cellBounds = getGridCellRenderBounds(offset, options, styles);
    const gridSize = getGridSize(options);

    return {
        x: cellBounds.x,
        y: cellBounds.y,
        height: gridSize.height * cellBounds.height,
        width: gridSize.width * cellBounds.width,
    };
};

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
        const position = {
            x: width * columnIndex + brickOffsetX,
            y: height * rowIndex,
        };

        return {
            absolutePosition: position,
            position: position,
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
        const position = {
            x: width * columnIndex,
            y: height * rowIndex + peyoteOffsetY,
        };

        return {
            absolutePosition: position,
            position: position,
            height: height,
            width: width,
        };
    };

    const getSquaredCellOffset = (offset: BeadingGridOffset) => {
        const { columnIndex, rowIndex } = offset;
        const position = {
            x: width * columnIndex,
            y: height * rowIndex,
        };

        return {
            absolutePosition: position,
            position: position,
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
    const cellRenderBounds = bounds.cells.map((cell) =>
        getGridCellRenderBounds(cell.offset, options, styles)
    );
    const minX = Math.min(...cellRenderBounds.map((cell) => cell.position.x));
    const minY = Math.min(...cellRenderBounds.map((cell) => cell.position.y));
    const maxX = Math.max(
        ...cellRenderBounds.map((cell) => cell.position.x + cell.width)
    );
    const maxY = Math.max(
        ...cellRenderBounds.map((cell) => cell.position.y + cell.height)
    );

    return {
        position: {
            x: minX,
            y: minY,
        },
        height: maxY - minY,
        width: maxX - minX,
    };
};

export const getGridRenderBounds = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const topLeftCellBounds = getGridCellRenderBounds(offset, options, styles);
    const gridSize = getGridSize(options);

    return {
        position: topLeftCellBounds.position,
        height: gridSize.height * topLeftCellBounds.height,
        width: gridSize.width * topLeftCellBounds.width,
    };
};

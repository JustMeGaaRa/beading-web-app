import {
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridRectangle,
    BeadingGridStateLegacy,
    BeadingGridStyles,
    BeadingGridWindow,
    BrickGridProperties,
    PeyoteGridProperties,
    SquareGridProperties,
} from "../types";
import { flipBead } from "./common";

export const getGridCellSize = (
    options: BeadingGridProperties,
    styles: BeadingGridStyles
) => {
    const beadSize =
        options.type === "brick" ? flipBead(styles.bead) : styles.bead;
    const height = beadSize.height * styles.rendering.pixelPerPoint;
    const width = beadSize.width * styles.rendering.pixelPerPoint;

    return { height, width };
};

export const getGridSectionArea = (
    section: BeadingGridWindow,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): BeadingGridRectangle => {
    const cellSize = getGridCellSize(options, styles);
    const topLeftPosition = getGridCellOffset(section.offset, options, styles);

    return {
        position: topLeftPosition,
        width: section.width * cellSize.width,
        height: section.height * cellSize.height,
    };
};

export const getGridCellOffset = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
) => {
    const { height, width } = getGridCellSize(options, styles);

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
        };
    };

    const getPeyoteCellOffset = (
        offset: BeadingGridOffset,
        options: PeyoteGridProperties
    ) => {
        const getPeyoteOffsetY = (index: number) => {
            const columnOffsetNormal = index % 2;
            return cellStaggerY * columnOffsetNormal;
        };

        const { columnIndex, rowIndex } = offset;
        const peyoteOffsetY = getPeyoteOffsetY(columnIndex);

        return {
            x: width * columnIndex,
            y: height * rowIndex + peyoteOffsetY,
        };
    };

    const getSquaredCellOffset = (
        offset: BeadingGridOffset,
        options: SquareGridProperties
    ) => {
        const { columnIndex, rowIndex } = offset;

        return {
            x: width * columnIndex,
            y: height * rowIndex,
        };
    };

    return options.type === "brick"
        ? getBrickCellOffset(offset, options)
        : options.type === "peyote"
          ? getPeyoteCellOffset(offset, options)
          : getSquaredCellOffset(offset, options);
};

export const getGridSize = (
    grid: BeadingGridStateLegacy,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
) => {
    const cellSize = getGridCellSize(options, styles);

    const height =
        grid.rows.length * cellSize.height * styles.rendering.pixelPerPoint;
    const width =
        (grid.rows[0]?.cells.length ?? 0) *
        cellSize.width *
        styles.rendering.pixelPerPoint;

    return { height, width };
};

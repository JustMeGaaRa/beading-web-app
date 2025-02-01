import {
    RenderBounds,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridStyles,
    BrickGridProperties,
    BeadingGridSize,
    getGridSize,
    BeadingGridCell,
    shiftOffset,
    BeadingGrid,
    getCellKey,
    BeadingGridMetadata,
    flipBead,
    BeadProperties,
} from "../types";

export const getCellRenderSize = (
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): BeadingGridSize => {
    return options.type === "brick" ? flipBead(styles.bead) : styles.bead;
};

export const getCellRenderBounds = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const { height, width } = getCellRenderSize(options, styles);

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
    cells: Array<BeadingGridCell>,
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    // TODO: optimize to be O(n) complexity
    const cellRenderBounds = cells.map((cell) =>
        getCellRenderBounds(shiftOffset(cell.offset, offset), options, styles)
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

export const getGridRenderSize = (
    options: BeadingGridProperties,
    bead: BeadProperties
) => {
    const gridSize = getGridSize(options);

    return {
        height: gridSize.height * bead.height,
        width: gridSize.width * bead.width,
    };
};

export const getGridRenderBounds = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const topLeftCellBounds = getCellRenderBounds(offset, options, styles);
    const gridSize = getGridSize(options);

    return {
        position: topLeftCellBounds.position,
        height: gridSize.height * topLeftCellBounds.height,
        width: gridSize.width * topLeftCellBounds.width,
    };
};

export const getGridRenderBoundsNoFringe = (
    offset: BeadingGridOffset,
    options: BeadingGridProperties,
    styles: BeadingGridStyles
): RenderBounds => {
    const topLeftCellBounds = getCellRenderBounds(offset, options, styles);
    const gridSize = { height: options.height, width: options.width };

    return {
        position: topLeftCellBounds.position,
        height: gridSize.height * topLeftCellBounds.height,
        width: gridSize.width * topLeftCellBounds.width,
    };
};

export const combineRenderBounds = (
    gridBounds: Array<RenderBounds>
): RenderBounds => {
    if (gridBounds.length === 0) {
        return {
            position: { x: 0, y: 0 },
            width: 0,

            height: 0,
        } satisfies RenderBounds;
    }

    const minX = Math.min(...gridBounds.map((bounds) => bounds.position.x));
    const minY = Math.min(...gridBounds.map((bounds) => bounds.position.y));
    const maxX = Math.max(
        ...gridBounds.map((bounds) => bounds.position.x + bounds.width)
    );
    const maxY = Math.max(
        ...gridBounds.map((bounds) => bounds.position.y + bounds.height)
    );

    return {
        position: { x: minX, y: minY },
        width: maxX - minX,
        height: maxY - minY,
    } satisfies RenderBounds;
};

export const getGridMetadata = (
    grid: BeadingGrid,
    styles: BeadingGridStyles
): BeadingGridMetadata => {
    return {
        gridBounds: getGridRenderBounds(grid.offset, grid.options, styles),
        cellsBounds: grid.cells.reduce((map, cell) => {
            return map.set(
                getCellKey(cell),
                getCellRenderBounds(cell.offset, grid.options, styles)
            );
        }, new Map()),
    };
};

export type GridMetadataCache = ReturnType<typeof createGridMetadata>;

export const createGridMetadata = (
    grid: BeadingGrid,
    styles: BeadingGridStyles
) => {
    let gridBounds: RenderBounds;
    const cellsBounds = new Map<string, RenderBounds>();

    const getOrCreateGridBounds = () => {
        if (!gridBounds) {
            gridBounds = getGridRenderBounds(grid.offset, grid.options, styles);
        }
        return gridBounds;
    };

    const getOrCreateCellBounds = (cell: BeadingGridCell) => {
        if (!cellsBounds.has(getCellKey(cell))) {
            const renderBounds = getCellRenderBounds(
                cell.offset,
                grid.options,
                styles
            );
            cellsBounds.set(getCellKey(cell), renderBounds);
        }
        return cellsBounds.get(getCellKey(cell))!;
    };

    return {
        getGridBounds: getOrCreateGridBounds,
        getCellBounds: getOrCreateCellBounds,
    };
};

import {
    BeadingGridSectionBounds,
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSectionState,
    BeadingGridSize,
    BeadingGridState,
    shallowEqualsCell,
    shiftCell,
} from "../types";
import { capitalize } from "./common";
import { indeciesInBounds } from "./hittest";

export const copy = (
    grid: BeadingGridState,
    bounds: BeadingGridSectionBounds
): BeadingGridSectionState => {
    const gridRelativeCells = grid.cells.filter((cell) =>
        indeciesInBounds(bounds, cell.offset)
    );

    return {
        ...bounds,
        cells: gridRelativeCells,
    };
};

export const paste = (
    grid: BeadingGridState,
    section: BeadingGridSectionState,
    offset: BeadingGridOffset
): BeadingGridState => {
    const targetOffset = {
        columnIndex: offset.columnIndex - section.topLeft.columnIndex,
        rowIndex: offset.rowIndex - section.topLeft.rowIndex,
    };
    const targetBounds = getGridBounds(grid.options);

    const gridTargetCells = section.cells
        .map((cell) => shiftCell(cell, targetOffset))
        .filter((cell) => indeciesInBounds(targetBounds, cell.offset));
    const gridFilteredCells = grid.cells.filter(
        (cell) =>
            !gridTargetCells.some((target) => shallowEqualsCell(target, cell))
    );

    return {
        ...grid,
        cells: [...gridFilteredCells, ...gridTargetCells],
    };
};

export const clear = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>
): BeadingGridState => {
    return {
        ...grid,
        cells: grid.cells.filter(
            (cell) => !cells.some((target) => shallowEqualsCell(target, cell))
        ),
    };
};

export const shift = (
    section: BeadingGridSectionState,
    offset: BeadingGridOffset
): BeadingGridSectionState => {
    return {
        ...section,
        topLeft: {
            columnIndex: section.topLeft.columnIndex + offset.columnIndex,
            rowIndex: section.topLeft.rowIndex + offset.rowIndex,
        },
        cells: section.cells.map((cell) => shiftCell(cell, offset)),
    };
};

export type FlipAxis = "horizontal" | "vertical";

export const flip = (
    section: BeadingGridSectionState,
    axis: FlipAxis
): BeadingGridSectionState => {
    return {
        ...section,
        cells: section.cells.map((cell) => {
            const sectionRelativeOffset = {
                columnIndex:
                    cell.offset.columnIndex - section.topLeft.columnIndex,
                rowIndex: cell.offset.rowIndex - section.topLeft.rowIndex,
            };

            const cellOffset = {
                columnIndex:
                    axis === "vertical"
                        ? Math.abs(
                              section.width -
                                  1 -
                                  sectionRelativeOffset.columnIndex
                          )
                        : sectionRelativeOffset.columnIndex,
                rowIndex:
                    axis === "horizontal"
                        ? Math.abs(
                              section.height -
                                  1 -
                                  sectionRelativeOffset.rowIndex
                          )
                        : sectionRelativeOffset.rowIndex,
            };

            const gridRelativeOffset = {
                columnIndex:
                    cellOffset.columnIndex + section.topLeft.columnIndex,
                rowIndex: cellOffset.rowIndex + section.topLeft.rowIndex,
            };

            return {
                ...cell,
                offset: gridRelativeOffset,
            };
        }),
    };
};

export const getGridHeight = (options: BeadingGridProperties) => {
    return options.type === "brick"
        ? options.height + options.fringe
        : options.height;
};

export const getGridSize = (
    options: BeadingGridProperties
): BeadingGridSize => {
    return {
        height: getGridHeight(options),
        width: options.width,
    };
};

export const getGridBounds = (
    options: BeadingGridProperties
): BeadingGridSectionBounds => {
    return {
        topLeft: { columnIndex: 0, rowIndex: 0 },
        ...getGridSize(options),
    };
};

export const getGridSectionBounds = (
    cells: Array<BeadingGridCellState>
): BeadingGridSectionState => {
    const minColumnIndex = Math.min(
        ...cells.map((cell) => cell.offset.columnIndex)
    );
    const minRowIndex = Math.min(...cells.map((cell) => cell.offset.rowIndex));
    const maxColumnIndex = Math.max(
        ...cells.map((cell) => cell.offset.columnIndex)
    );
    const maxRowIndex = Math.max(...cells.map((cell) => cell.offset.rowIndex));
    const height = maxRowIndex - minRowIndex + 1;
    const width = maxColumnIndex - minColumnIndex + 1;

    return {
        topLeft: { columnIndex: minColumnIndex, rowIndex: minRowIndex },
        height,
        width,
        cells,
    };
};

const parseGridNumber = (name?: string) => {
    if (!name) return 1;

    const numbersInName = name
        .split(" ")
        .map((word) => Number(word))
        .filter((word) => Number.isInteger(word));
    const lastGridNumber = numbersInName.length > 0 ? numbersInName.at(-1)! : 1;
    return lastGridNumber;
};

const buildGridName = (
    options: BeadingGridProperties,
    gridCount: number = 1
) => {
    return `${capitalize(options.type)} Grid ${gridCount}`;
};

export const getCurrentGridName = (
    options: BeadingGridProperties,
    currentName?: string
) => {
    const lastGridNumber = parseGridNumber(currentName);
    return buildGridName(options, lastGridNumber);
};

export const getNextGridName = (
    options: BeadingGridProperties,
    currentName: string
) => {
    const lastGridNumber = parseGridNumber(currentName);
    return buildGridName(options, lastGridNumber + 1);
};

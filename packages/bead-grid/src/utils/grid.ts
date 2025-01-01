import {
    BeadingGridBounds,
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSection,
    BeadingGridState,
    shallowEqualsCell,
    shift,
} from "../types";
import { capitalize } from "./common";
import { indeciesInBounds } from "./hittest";

export const createDefault = (
    options: BeadingGridProperties
): BeadingGridState => {
    return {
        name: buildGridName(options),
        offset: { columnIndex: 0, rowIndex: 0 },
        cells: [],
        options: options,
    };
};

// primitive actions:
// - copy
// - paste
// - clear
// - flip
// - shift
// - set

export const copy = (
    grid: BeadingGridState,
    area: BeadingGridBounds
): BeadingGridSection => {
    const gridRelativeCells = grid.cells.filter((cell) =>
        indeciesInBounds(area, cell.offset)
    );

    return {
        ...area,
        cells: gridRelativeCells,
    };
};

export const paste = (
    grid: BeadingGridState,
    section: BeadingGridSection,
    offset: BeadingGridOffset
): BeadingGridState => {
    const targetOffset = {
        columnIndex: offset.columnIndex - section.offset.columnIndex,
        rowIndex: offset.rowIndex - section.offset.rowIndex,
    };
    const targetBounds = getGridBounds(grid.options, grid.offset);

    const gridTargetCells = section.cells
        .map((cell) => shift(cell, targetOffset))
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

export const flip = (
    grid: BeadingGridState,
    area: BeadingGridBounds,
    axis: "horizontal" | "vertical"
): BeadingGridState => {
    return {
        ...grid,
        cells: grid.cells.map((cell) =>
            indeciesInBounds(area, cell.offset)
                ? {
                      ...cell,
                      offset: {
                          columnIndex:
                              axis === "horizontal"
                                  ? area.offset.columnIndex +
                                    area.width -
                                    1 -
                                    cell.offset.columnIndex
                                  : cell.offset.columnIndex,
                          rowIndex:
                              axis === "vertical"
                                  ? area.offset.rowIndex +
                                    area.height -
                                    1 -
                                    cell.offset.rowIndex
                                  : cell.offset.rowIndex,
                      },
                  }
                : cell
        ),
    };
};

export const getGridHeight = (options: BeadingGridProperties) => {
    return options.type === "brick"
        ? options.height + options.fringe
        : options.height;
};

export const getGridSize = (options: BeadingGridProperties) => {
    return {
        height: getGridHeight(options),
        width: options.width,
    };
};

export const getGridBounds = (
    options: BeadingGridProperties,
    offset: BeadingGridOffset
) => {
    return {
        offset,
        ...getGridSize(options),
    };
};

const getGridNumber = (name: string) => {
    const numbersInName = name
        .split(" ")
        .map((word) => Number(word))
        .filter((word) => Number.isInteger(word));
    const lasteGridNumber = numbersInName.length > 0 ? numbersInName[0]! : 1;
    return lasteGridNumber;
};

const buildGridName = (
    options: BeadingGridProperties,
    gridCount: number = 1
) => {
    return `${capitalize(options.type)} Grid ${gridCount}`;
};

export const restoreGridName = (
    options: BeadingGridProperties,
    currentName: string
) => {
    const lasteGridNumber = getGridNumber(currentName);
    return buildGridName(options, lasteGridNumber);
};

export const nextGridName = (
    options: BeadingGridProperties,
    currentName: string
) => {
    const lasteGridNumber = getGridNumber(currentName);
    return buildGridName(options, lasteGridNumber + 1);
};

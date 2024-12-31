import {
    BeadingGridBounds,
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
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

// primitive actions: copy, paste, clear, shift, flip, set

export const copy = (
    grid: BeadingGridState,
    area: BeadingGridBounds
): Array<BeadingGridCellState> => {
    return grid.cells.filter((cell) => indeciesInBounds(area, cell.offset));
};

export const paste = (
    grid: BeadingGridState,
    cells: Array<BeadingGridCellState>,
    offset: BeadingGridOffset
): BeadingGridState => {
    const modifiedCells = cells.map((cell) => shift(cell, offset));
    return {
        ...grid,
        cells: [
            ...grid.cells.filter(
                (cell) =>
                    !modifiedCells.some((target) =>
                        shallowEqualsCell(target, cell)
                    )
            ),
            ...modifiedCells,
        ],
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
        ...offset,
        ...getGridSize(options),
    };
};

export const getGridNumber = (name: string) => {
    const numbersInName = name
        .split(" ")
        .map((word) => Number(word))
        .filter((word) => Number.isInteger(word));
    const lasteGridNumber = numbersInName.length > 0 ? numbersInName[0]! : 1;
    return lasteGridNumber;
};

export const buildGridName = (
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

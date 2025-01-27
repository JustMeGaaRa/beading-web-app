import {
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSection,
    BeadingGrid,
    shallowEqualsCell,
    shiftCell,
    BeadProperties,
    createGridSection,
    getGridSize,
    createGridBounds,
    shiftOffset,
    negateOffset,
} from "../types";
import { capitalize } from "./common";
import { indeciesInBounds } from "./hittest";

export const copy = (
    _: BeadingGrid,
    cells: Array<BeadingGridCell>
): BeadingGridSection => {
    const bounds = createGridSection(cells);

    return {
        ...bounds,
        cells: cells,
    };
};

export const paste = (
    grid: BeadingGrid,
    section: BeadingGridSection,
    offset: BeadingGridOffset
): BeadingGrid => {
    const targetOffset = shiftOffset(offset, negateOffset(section.offset));
    const targetBounds = createGridBounds(grid.options, grid.offset);

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
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): BeadingGrid => {
    return {
        ...grid,
        cells: grid.cells.filter(
            (cell) => !cells.some((target) => shallowEqualsCell(target, cell))
        ),
    };
};

export const shift = (
    section: BeadingGridSection,
    offset: BeadingGridOffset
): BeadingGridSection => {
    return {
        ...section,
        offset: shiftOffset(section.offset, offset),
        cells: section.cells.map((cell) => shiftCell(cell, offset)),
    };
};

export type FlipAxis = "horizontal" | "vertical";

export const flip = (
    section: BeadingGridSection,
    axis: FlipAxis
): BeadingGridSection => {
    const swapIndecies = (index: number, length: number) => {
        return Math.abs(length - 1 - index);
    };

    return {
        ...section,
        cells: section.cells.map((cell) => {
            const sectionRelativeOffset = shiftOffset(
                cell.offset,
                negateOffset(section.offset)
            );

            const cellOffset = {
                columnIndex:
                    axis === "vertical"
                        ? swapIndecies(
                              sectionRelativeOffset.columnIndex,
                              section.width
                          )
                        : sectionRelativeOffset.columnIndex,
                rowIndex:
                    axis === "horizontal"
                        ? swapIndecies(
                              sectionRelativeOffset.rowIndex,
                              section.height
                          )
                        : sectionRelativeOffset.rowIndex,
            };

            const gridRelativeOffset = shiftOffset(cellOffset, section.offset);

            return {
                ...cell,
                offset: gridRelativeOffset,
            };
        }),
    };
};

export const getGridRealSize = (
    options: BeadingGridProperties,
    bead: BeadProperties
) => {
    const gridSize = getGridSize(options);

    return {
        height: gridSize.height * bead.height,
        width: gridSize.width * bead.width,
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

import { BeadingGridOffset, distanceBetween } from "./BeadingGridOffset";
import {
    BeadingGridCell,
    shallowEqualsCell,
    shiftCell,
} from "./BeadingGridCell";
import { BeadingGridProperties } from "./BeadingGridProperties";
import { BeadingGridSection, createGridSection } from "./BeadingGridSection";
import { createGridBounds, indeciesInBounds } from "./BeadingGridBounds";

export type BeadingGrid = {
    gridId: string;
    offset: BeadingGridOffset;
    name: string;
    cells: Array<BeadingGridCell>;
    options: BeadingGridProperties;
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

export const copy = (
    _: BeadingGrid,
    cells: Array<BeadingGridCell>
): BeadingGridSection => {
    return createGridSection(cells);
};

export const cut = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
): [BeadingGrid, BeadingGridSection] => {
    const copiedSection = copy(grid, cells);
    const clearedGrid = clear(grid, cells);
    return [clearedGrid, copiedSection];
};

export const paste = (
    grid: BeadingGrid,
    section: BeadingGridSection,
    offset: BeadingGridOffset
): BeadingGrid => {
    const targetOffset = distanceBetween(section.offset, offset);
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

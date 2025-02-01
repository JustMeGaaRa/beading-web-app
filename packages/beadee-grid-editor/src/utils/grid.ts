import {
    BeadingGrid,
    BeadingGridCell,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSection,
    BeadProperties,
    cut,
    getGridSize,
    paste,
    POINT_PIXEL_RATIO,
    shift,
} from "../types";
import { capitalize } from "./common";

export const getGridRealSize = (
    options: BeadingGridProperties,
    bead: BeadProperties
) => {
    const gridSize = getGridSize(options);

    return {
        height: (gridSize.height * bead.height) / POINT_PIXEL_RATIO,
        width: (gridSize.width * bead.width) / POINT_PIXEL_RATIO,
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

export const createSectionDragContext = (
    grid: BeadingGrid,
    cells: Array<BeadingGridCell>
) => {
    let originalGrid: BeadingGrid;
    let currentGrid: BeadingGrid;
    let originalSection: BeadingGridSection;
    let currentSection: BeadingGridSection;

    const start = (): [BeadingGrid, BeadingGridSection] => {
        const [clearedGrid, section] = cut(grid, cells);
        originalGrid = grid;
        currentGrid = clearedGrid;
        originalSection = { ...section } satisfies BeadingGridSection;
        currentSection = { ...section } satisfies BeadingGridSection;
        return [clearedGrid, section];
    };

    const accept = (): [BeadingGrid, BeadingGridSection] => {
        currentGrid = paste(currentGrid, currentSection, currentSection.offset);
        return [currentGrid, currentSection];
    };

    const cancel = (): [BeadingGrid, BeadingGridSection] => {
        return [originalGrid, originalSection];
    };

    const move = (offset: BeadingGridOffset): BeadingGridSection => {
        currentSection = shift(currentSection, offset);
        return currentSection;
    };

    return {
        start,
        accept,
        cancel,
        move,
    };
};

import {
    BeadingGridSectionBounds,
    BeadingGridCellState,
    BeadingGridOffset,
    BeadingGridProperties,
    BeadingGridSection,
    BeadingGridSize,
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
        cells: [],
        options: options,
    };
};

export const copy = (
    grid: BeadingGridState,
    bounds: BeadingGridSectionBounds
): BeadingGridSection => {
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
    section: BeadingGridSection,
    offset: BeadingGridOffset
): BeadingGridState => {
    const targetOffset = {
        columnIndex: offset.columnIndex - section.topLeft.columnIndex,
        rowIndex: offset.rowIndex - section.topLeft.rowIndex,
    };
    const targetBounds = getGridBounds(grid.options);

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

export type FlipAxis = "horizontal" | "vertical";

export const flip = (
    section: BeadingGridSection,
    axis: FlipAxis
): BeadingGridSection => {
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
): BeadingGridSection => {
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

export const getGridWindow = (
    startCell: BeadingGridOffset,
    endCell: BeadingGridOffset
): BeadingGridSectionBounds => {
    const topLeftRowIndex = Math.min(startCell.rowIndex, endCell.rowIndex);
    const topLeftColumnIndex = Math.min(
        startCell.columnIndex,
        endCell.columnIndex
    );
    const bottomRightRowIndex = Math.max(startCell.rowIndex, endCell.rowIndex);
    const bottomRightColumnIndex = Math.max(
        startCell.columnIndex,
        endCell.columnIndex
    );

    return {
        topLeft: {
            rowIndex: topLeftRowIndex,
            columnIndex: topLeftColumnIndex,
        },
        height: bottomRightRowIndex - topLeftRowIndex + 1,
        width: bottomRightColumnIndex - topLeftColumnIndex + 1,
    };
};

export const getGridWindowProjection = (
    grid: BeadingGridState,
    centerSection: BeadingGridSectionBounds,
    projection: "horizontal" | "vertical"
): Array<BeadingGridSectionBounds> => {
    const gridHeight = grid.options.height - 1;
    const gridWidth = grid.options.width - 1;
    const mirrors: BeadingGridSectionBounds[] = [];

    const { columnIndex, rowIndex } = centerSection.topLeft;
    const { width, height } = centerSection;

    const rightEdge = columnIndex + width;
    const bottomEdge = rowIndex + height;

    if (projection === "horizontal") {
        // left window
        if (columnIndex > 0) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: columnIndex - width, rowIndex: rowIndex },
                    { columnIndex: columnIndex - 1, rowIndex: bottomEdge - 1 }
                )
            );
        }

        // right window
        if (rightEdge < gridWidth) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: rightEdge, rowIndex: rowIndex },
                    {
                        columnIndex: rightEdge + width - 1,
                        rowIndex: bottomEdge - 1,
                    }
                )
            );
        }
    }

    if (projection === "vertical") {
        // top window
        if (rowIndex > 0) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: columnIndex, rowIndex: rowIndex - height },
                    { columnIndex: rightEdge - 1, rowIndex: rowIndex - 1 }
                )
            );
        }

        // bottom window
        if (bottomEdge < gridHeight) {
            mirrors.push(
                getGridWindow(
                    { columnIndex: columnIndex, rowIndex: bottomEdge },
                    {
                        columnIndex: rightEdge - 1,
                        rowIndex: bottomEdge + height - 1,
                    }
                )
            );
        }
    }

    return mirrors;
};

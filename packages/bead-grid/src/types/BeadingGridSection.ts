import { BeadingGridBounds } from "./BeadingGridBounds";
import { BeadingGridCell, shiftCell } from "./BeadingGridCell";
import {
    BeadingGridOffset,
    negateOffset,
    shiftOffset,
} from "./BeadingGridOffset";

export type BeadingGridSection = {
    cells: Array<BeadingGridCell>;
} & BeadingGridBounds;

export const createGridSection = (
    cells: Array<BeadingGridCell>
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
        offset: { columnIndex: minColumnIndex, rowIndex: minRowIndex },
        height,
        width,
        cells,
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

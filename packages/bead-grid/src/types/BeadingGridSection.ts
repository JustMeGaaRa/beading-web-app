import { BeadingGridBounds } from "./BeadingGridBounds";
import { BeadingGridCell } from "./BeadingGridCell";

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

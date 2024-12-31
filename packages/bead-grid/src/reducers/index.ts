import {
    BeadingGridBounds,
    BeadingGridOffset,
    BeadingGridSection,
    BeadingGridState,
} from "../types";

export * from "./gridApplyOptionsReducer";
export * from "./gridClearColumnReducer";
export * from "./gridClearRowReducer";
export * from "./gridDeleteColumnReducer";
export * from "./gridDeleteRowReducer";
export * from "./gridInsertColumnReducer";
export * from "./gridInsertRowReducer";
export * from "./gridReducer";
export * from "./gridSetCellReducer";
export * from "./gridSetSelectedCellsReducer";

export const getGridWindow = (
    startCell: BeadingGridOffset,
    endCell: BeadingGridOffset
): BeadingGridBounds => {
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
        rowIndex: topLeftRowIndex,
        columnIndex: topLeftColumnIndex,
        height: bottomRightRowIndex - topLeftRowIndex + 1,
        width: bottomRightColumnIndex - topLeftColumnIndex + 1,
    };
};

export const getGridWindowProjection = (
    grid: BeadingGridState,
    centerSection: BeadingGridBounds,
    projection: "horizontal" | "vertical"
): Array<BeadingGridBounds> => {
    const gridHeight = grid.options.height - 1;
    const gridWidth = grid.options.width - 1;
    const mirrors: BeadingGridBounds[] = [];

    const { columnIndex: columnIndex, rowIndex: rowIndex } = centerSection;
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

export const getSection = (
    _grid: BeadingGridState,
    _window: BeadingGridBounds
) => {
    // const { columnIndex, rowIndex, height } = window;
    // return {
    //     ...window,
    //     rows: grid.cells.slice(rowIndex, rowIndex + height),
    //     // .map((row) => ({
    //     //     cells: row.cells.slice(
    //     //         offset.columnIndex,
    //     //         offset.columnIndex + width
    //     //     ),
    //     // })),
    // };
};

export const flipSection = (
    _section: BeadingGridSection,
    _direction: "horizontal" | "vertical"
) => {
    // const clonedRows = section.rows.map((row) => ({ cells: [...row.cells] }));
    // if (direction === "vertical") {
    //     for (let rowIndex = 0; rowIndex < section.height / 2; rowIndex++) {
    //         const oppositeRowIndex = section.height - rowIndex - 1;
    //         if (clonedRows[rowIndex] && clonedRows[oppositeRowIndex]) {
    //             [clonedRows[rowIndex], clonedRows[oppositeRowIndex]] = [
    //                 clonedRows[oppositeRowIndex],
    //                 clonedRows[rowIndex],
    //             ];
    //         }
    //     }
    // }
    // if (direction === "horizontal") {
    //     for (let rowIndex = 0; rowIndex < section.height; rowIndex++) {
    //         for (
    //             let columnIndex = 0;
    //             columnIndex < section.width / 2;
    //             columnIndex++
    //         ) {
    //             const oppositeColumnIndex = section.width - columnIndex - 1;
    //             [
    //                 clonedRows[rowIndex].cells[columnIndex],
    //                 clonedRows[rowIndex].cells[oppositeColumnIndex],
    //             ] = [
    //                 clonedRows[rowIndex].cells[oppositeColumnIndex],
    //                 clonedRows[rowIndex].cells[columnIndex],
    //             ];
    //         }
    //     }
    // }
    // return {
    //     ...section,
    //     rows: clonedRows,
    // };
};

// TODO: replace with indeciesInBounds in the grid.ts file
export const isPositionInBounds = (
    grid: BeadingGridState,
    offset: BeadingGridOffset,
    columnIndex: number,
    rowIndex: number
) => {
    return (
        offset.rowIndex + rowIndex >= 0 &&
        offset.rowIndex + rowIndex < grid.options.height &&
        offset.columnIndex + columnIndex >= 0 &&
        offset.columnIndex + columnIndex < grid.options.width
    );
};

export const mergeSection = (
    _grid: BeadingGridState,
    _targetWindow: BeadingGridBounds,
    _sourceSection: BeadingGridSection
) => {
    // const clonedRows = grid.rows.map((row) => ({ cells: [...row.cells] }));
    // sourceSection.rows.forEach((row, rowIndex) => {
    //     row.cells.forEach((cell, columnIndex) => {
    //         if (
    //             isPositionInBounds(
    //                 grid,
    //                 targetWindow.offset,
    //                 columnIndex,
    //                 rowIndex
    //             ) &&
    //             !isNullOrEmpty(cell)
    //         ) {
    //             const targetRowIndex = targetWindow.offset.rowIndex + rowIndex;
    //             const targetColumnIndex =
    //                 targetWindow.offset.columnIndex + columnIndex;
    //             if (clonedRows[targetRowIndex]) {
    //                 clonedRows[targetRowIndex].cells[targetColumnIndex] = cell;
    //             }
    //         }
    //     });
    // });
    // return {
    //     ...grid,
    //     rows: clonedRows,
    // };
};

export const mirrorSection = (
    _grid: BeadingGridState,
    _targetWindow: BeadingGridBounds,
    _sourceWindow: BeadingGridBounds,
    _direction: "horizontal" | "vertical"
) => {
    // const sourceSection = getSection(grid, sourceWindow);
    // const flippedSection = flipSection(sourceSection, direction);
    // const modifiedGrid = mergeSection(grid, targetWindow, flippedSection);
    // return modifiedGrid;
};

export const dulicateSection = (
    _grid: BeadingGridState,
    _targetWindow: BeadingGridBounds,
    _sourceWindow: BeadingGridBounds
) => {
    // const sourceSection = getSection(grid, sourceWindow);
    // const modifiedGrid = mergeSection(grid, targetWindow, sourceSection);
    // return modifiedGrid;
};

export const clearSection = (grid: BeadingGridState) => {
    return grid;
};

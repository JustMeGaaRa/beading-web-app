export type BeadingGridOffset = {
    columnIndex: number;
    rowIndex: number;
};

export type BeadingGridSize = {
    height: number;
    width: number;
};

export const shiftOffset = (
    offset: BeadingGridOffset,
    shift: BeadingGridOffset
): BeadingGridOffset => {
    return {
        columnIndex: offset.columnIndex + shift.columnIndex,
        rowIndex: offset.rowIndex + shift.rowIndex,
    };
};

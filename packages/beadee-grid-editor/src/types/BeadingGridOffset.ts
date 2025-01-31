export type BeadingGridOffset = {
    columnIndex: number;
    rowIndex: number;
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

export const negateOffset = (offset: BeadingGridOffset): BeadingGridOffset => {
    return {
        columnIndex: -offset.columnIndex,
        rowIndex: -offset.rowIndex,
    };
};

export const distanceBetween = (
    first: BeadingGridOffset,
    second: BeadingGridOffset
): BeadingGridOffset => {
    return {
        columnIndex: second.columnIndex - first.columnIndex,
        rowIndex: second.rowIndex - first.rowIndex,
    };
};

export const isZeroOffset = (offset: BeadingGridOffset): boolean => {
    return offset.columnIndex === 0 && offset.rowIndex === 0;
};

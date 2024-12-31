export type BeadingGridOffset = {
    columnIndex: number;
    rowIndex: number;
};

export type BeadingGridSize = {
    height: number;
    width: number;
};

export type BeadingGridBounds = BeadingGridOffset & BeadingGridSize;

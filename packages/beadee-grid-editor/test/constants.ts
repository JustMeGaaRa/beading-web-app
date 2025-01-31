import { BeadingGrid } from "../src";

export const Brick10x10EmptyGrid: BeadingGrid = {
    gridId: "brick-10x10-empty",
    offset: { columnIndex: 0, rowIndex: 0 },
    name: "Brick Grid 1",
    cells: [],
    options: {
        type: "brick",
        height: 10,
        width: 10,
        drop: 3,
        fringe: 2,
    },
};

export const Square10x10EmptyGrid: BeadingGrid = {
    gridId: "square-10x10-empty",
    offset: { columnIndex: 0, rowIndex: 0 },
    name: "Test Grid",
    cells: [],
    options: {
        type: "square",
        height: 10,
        width: 10,
    },
};

export const Square3x3GridWithCellsOnDiagonal: BeadingGrid = {
    gridId: "square-3x3-diagonal",
    offset: { columnIndex: 0, rowIndex: 0 },
    name: "Square Grid 1",
    cells: [
        { color: "red", offset: { columnIndex: 0, rowIndex: 0 } },
        { color: "blue", offset: { columnIndex: 1, rowIndex: 1 } },
        { color: "green", offset: { columnIndex: 2, rowIndex: 2 } },
    ],
    options: {
        type: "square",
        height: 3,
        width: 3,
    },
};

export const Square7x9GridWithCellsFormingLetterS: BeadingGrid = {
    gridId: "square-7x9-s",
    offset: { columnIndex: 0, rowIndex: 0 },
    name: "Square Grid 1",
    cells: [
        { color: "blue", offset: { columnIndex: 2, rowIndex: 2 } },
        { color: "blue", offset: { columnIndex: 3, rowIndex: 2 } },
        { color: "blue", offset: { columnIndex: 4, rowIndex: 2 } },
        { color: "blue", offset: { columnIndex: 2, rowIndex: 3 } },
        { color: "blue", offset: { columnIndex: 2, rowIndex: 4 } },
        { color: "blue", offset: { columnIndex: 3, rowIndex: 4 } },
        { color: "blue", offset: { columnIndex: 4, rowIndex: 4 } },
        { color: "blue", offset: { columnIndex: 4, rowIndex: 5 } },
        { color: "blue", offset: { columnIndex: 4, rowIndex: 6 } },
        { color: "blue", offset: { columnIndex: 3, rowIndex: 6 } },
        { color: "blue", offset: { columnIndex: 2, rowIndex: 6 } },
    ],
    options: {
        type: "square",
        height: 9,
        width: 7,
    },
};

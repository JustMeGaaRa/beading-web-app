import { BeadingGridState } from "../src";

export const Brick10x10GridWitoutCells: BeadingGridState = {
    name: "Brick Grid 1",
    offset: { columnIndex: 0, rowIndex: 0 },
    cells: [],
    options: {
        type: "brick",
        height: 10,
        width: 10,
        drop: 3,
        fringe: 2,
    },
};

export const SquareEmptyGrid: BeadingGridState = {
    name: "Test Grid",
    offset: { columnIndex: 0, rowIndex: 0 },
    cells: [],
    options: {
        type: "square",
        height: 10,
        width: 10,
    },
};

export const Square3x3GridWithCells: BeadingGridState = {
    name: "Square Grid 1",
    offset: { columnIndex: 0, rowIndex: 0 },
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

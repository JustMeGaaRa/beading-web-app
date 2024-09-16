export type Cell = string;

export type BeadSize = {
    title: string;
    height: number;
    width: number;
};

export type BeadingGridType =
    | "square"
    | "peyote"
    | "brick";

export type SquareGridProperties = {
    type: "square";
    height: number;
    width: number;
};

export type PeyoteGridProperties = {
    type: "peyote";
    height: number;
    width: number;
};

export type BrickGridProperties = {
    type: "brick";
    height: number;
    width: number;
    fringe: number;
    drop: number;
};

export type BeadingGridProperties =
    | SquareGridProperties
    | PeyoteGridProperties
    | BrickGridProperties;

export type BeadingGridRow = {
    cells: Array<string>;
};

export type BeadingGridCellState = {
    color: string;
    columnIndex: number;
    rowIndex: number;
};

export type BeadingGridState = {
    name: string;
    rows: Array<BeadingGridRow>;
    options: BeadingGridProperties;
};

export type BeadingGridMetadata = {
    offset: GridCellPosition;
    divider: {
        offset: GridCellPosition;
        length: number;
    };
    text: GridCellPosition;
};

export type GridCellPosition = {
    rowIndex: number;
    columnIndex: number;
};

export type GridWindow = {
    offset: GridCellPosition;
    height: number;
    width: number;
};

export type GridWindowSet = {
    center: GridWindow;
    other: Array<GridWindow>;
};

export type GridSection = {
    offset: GridCellPosition;
    height: number;
    width: number;
    rows: Array<BeadingGridRow>;
};

export type RenderArea = {
    position: { x: number; y: number };
    width: number;
    height: number;
};

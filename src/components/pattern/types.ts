export type LayoutOrientation = "vertical" | "horizontal";

export type BeadSize = {
    title: string;
    height: number;
    width: number;
};

export type PatternLayoutOptions = {
    beadSize: BeadSize;
    orientation: LayoutOrientation;
    height: number;
    width: number;
};

export type PatternOptions = {
    layout: PatternLayoutOptions;
};

export type PatternSummary = {
    totalBeads: number;
    beadSize: BeadSize;
    totalSize: BeadSize;
    beads: Array<{
        color: string;
        colorName: string;
        number: number;
    }>;
};

export type BeadingGridType = "square" | "peyote" | "brick";

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
    row: number;
    column: number;
    color: string;
};

export type BeadingGridState = {
    name: string;
    rows: Array<BeadingGridRow>;
    options: BeadingGridProperties;
};

export type PatternState = {
    patternId: string;
    coverUrl: string;
    lastModified: Date;
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
};

export type BeadingGridMetadata = {
    position: { x: number; y: number };
    size: { height: number; width: number };
    divider: { isVisible: boolean; points: Array<number> };
};

export type PatternMetadata = {
    size: { height: number; width: number };
    grids: Record<string, BeadingGridMetadata>;
};

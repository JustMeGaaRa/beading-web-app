import { SetStateAction } from "react";

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
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
};

export type PatternActions = {
    setName: React.Dispatch<SetStateAction<string>>;
    setOptions: React.Dispatch<SetStateAction<PatternOptions>>;
    setGrids: React.Dispatch<SetStateAction<Array<BeadingGridState>>>;
    setGridCount: React.Dispatch<SetStateAction<number>>;
};

import { BeadingGridMetadata, BeadingGridState, BeadSize } from "../beading-grid";

export type LayoutOrientation = "vertical" | "horizontal";

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

export type PatternState = {
    patternId: string;
    coverUrl: string;
    lastModified: Date;
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
};

export type PatternMetadata = {
    grids: Record<string, BeadingGridMetadata>;
};

export type TextState = {
    gridName: string;
    gridIndex: number;
    patternIndex: number;
};

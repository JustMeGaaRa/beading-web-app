import {
    BeadingGridMetadata,
    BeadingGridState,
    BeadingGridType,
    BeadSize,
} from "../beading-grid";

export type LayoutOrientation = "vertical" | "horizontal";

export type PatternLayoutOptions = {
    type: BeadingGridType;
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
    totalSize: PatternSize;
    beads: Array<{
        color: string;
        colorName: string;
        number: number;
    }>;
};

export type PatternVersion = "1.0.0";

export type PatternState = {
    version: PatternVersion;
    patternId: string;
    coverUrl: string;
    lastModified: Date;
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
};

export type PatternSize = {
    height: number;
    width: number;
};

export type PatternMetadata = {
    grids: Record<string, BeadingGridMetadata>;
};

export type TextState = {
    gridName: string;
    gridIndex: number;
    patternIndex: number;
};

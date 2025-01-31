import { BeadingGridMetadata, RenderBounds } from "@beadee/grid-editor";

export type PatternMetadata = {
    patternBounds: RenderBounds;
    gridsMetadata: Map<string, BeadingGridMetadata>;
};

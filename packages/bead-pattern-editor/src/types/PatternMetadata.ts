import { BeadingGridMetadata, RenderBounds } from "@repo/bead-grid";

export type PatternMetadata = {
    patternBounds: RenderBounds;
    gridsMetadata: Map<string, BeadingGridMetadata>;
};

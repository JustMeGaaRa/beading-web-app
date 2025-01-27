import { RenderBounds } from "./RenderBounds";

export type BeadingGridMetadata = {
    gridBounds: RenderBounds;
    cellsBounds: Map<string, RenderBounds>;
};

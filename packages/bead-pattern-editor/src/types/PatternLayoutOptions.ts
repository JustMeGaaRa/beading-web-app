import { BeadingGridType, BeadSize, LayoutOrientation } from "@repo/bead-grid";

export type PatternLayoutOptions = {
    type: BeadingGridType;
    beadSize: BeadSize;
    orientation: LayoutOrientation;
    height: number;
    width: number;
};

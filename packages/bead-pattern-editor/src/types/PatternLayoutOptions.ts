import { BeadingGridType, BeadSize } from "@repo/bead-grid";
import { LayoutOrientation } from "./LayoutOrientation";

export type PatternLayoutOptions = {
    type: BeadingGridType;
    beadSize: BeadSize;
    orientation: LayoutOrientation;
    height: number;
    width: number;
};

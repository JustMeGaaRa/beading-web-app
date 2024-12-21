import {
    BeadingGridType,
    BeadProperties,
    LayoutOrientation,
} from "@repo/bead-grid";

export type PatternLayoutOptions = {
    type: BeadingGridType;
    beadSize: BeadProperties;
    orientation: LayoutOrientation;
    height: number;
    width: number;
};

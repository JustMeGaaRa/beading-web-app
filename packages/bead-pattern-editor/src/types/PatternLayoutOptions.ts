import { BeadingGridType, BeadProperties } from "@repo/bead-grid";
import { PatternLayoutOrientation } from "./PatternLayoutOrientation";

export type PatternLayoutOptions = {
    orientation: PatternLayoutOrientation;
    type: BeadingGridType;
    beadSize: BeadProperties;
    height: number;
    width: number;
};

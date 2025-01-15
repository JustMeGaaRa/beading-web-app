import {
    BeadingGridType,
    BeadProperties,
    DefaultGridStyles,
} from "@repo/bead-grid";
import { PatternLayoutOrientation } from "./PatternLayoutOrientation";

export type PatternOptions = {
    orientation: PatternLayoutOrientation;
    type: BeadingGridType;
    beadSize: BeadProperties;
    height: number;
    width: number;
};

export const DefaultPatternOptions: PatternOptions = {
    type: "brick",
    orientation: "vertical",
    beadSize: DefaultGridStyles.bead,
    height: 16,
    width: 16,
};

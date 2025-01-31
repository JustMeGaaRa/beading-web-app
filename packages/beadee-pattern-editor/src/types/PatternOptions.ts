import {
    BeadingGridType,
    BeadProperties,
    ONE_SIX_BY_ONE_THREE,
} from "@beadee/grid-editor";
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
    beadSize: ONE_SIX_BY_ONE_THREE,
    height: 16,
    width: 16,
};

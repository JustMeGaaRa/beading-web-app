import { BeadingGridState, BeadingGridType, BeadSize, PatternOptions } from "./types";

export const CellPixelRatio = 20;
export const CellStrokeColor = "#718096";
export const CellDotColor = "#000000A3";
export const CellBlankColor = "";
export const DividerStrokeColor = "#00000029";

export const DefaultBeadingGrid: BeadingGridState = {
    name: "",
    rows: [],
    options: {
        type: "square",
        height: 0,
        width: 0,
    },
};

export const BeadingGridTypes: Array<BeadingGridType> = [
    "square",
    "peyote",
    "brick",
];

export const OneSixByOneThree: BeadSize = {
    title: "11/0 (1.6 x 1.3 mm)",
    height: 1.6,
    width: 1.3,
};

export const BeadSizeOptions: Array<BeadSize> = [OneSixByOneThree];

export const DefaultPatternOptions: PatternOptions = {
    layout: {
        beadSize: OneSixByOneThree,
        orientation: "horizontal",
        height: 10,
        width: 10,
    },
};

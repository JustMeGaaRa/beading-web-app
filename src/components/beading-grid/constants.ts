import { BeadingGridProperties, BeadingGridState, BeadingGridType, BeadSize } from "./types";

export const CellPixelRatio = 20;
export const CellStrokeColor = "#718096";
export const CellDotColor = "rgba(0, 0, 0, 0.36)";
export const CellBlankColor = "";
export const DividerStrokeColor = "#00000029";

export const FrameTextColor = "#718096";
export const FrameSelectedBorderColor = "#0BC5EA";
export const FrameSelectedFillColor = "#9DECF9";

export const DefaultGridOptions: BeadingGridProperties = {
    type: "brick",
    height: 40,
    width: 40,
    drop: 1,
    fringe: 0,
};

export const DefaultGrid: BeadingGridState = {
    name: "",
    rows: [],
    options: DefaultGridOptions,
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

export const TwoZerByOneFive: BeadSize = {
    title: "10/0 (2.0 x 1.5 mm)",
    height: 2.0,
    width: 1.5,
};

export const ThreeZeroByTwoFour: BeadSize = {
    title: "8/0 (3.0 x 2.4 mm)",
    height: 3.0,
    width: 2.4,
};

export const BeadSizeOptions: Array<BeadSize> = [
    OneSixByOneThree,
    TwoZerByOneFive,
    ThreeZeroByTwoFour
];

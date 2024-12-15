import {
    BeadingGridProperties,
    BeadingGridState,
    BeadingGridType,
    BeadSize,
} from "./types";

export const CELL_PIXEL_RATIO = 20;
export const CELL_BORDER_COLOR = "#718096";
export const CELL_DOT_COLOR = "rgba(0, 0, 0, 0.36)";
export const CELL_BLANK_COLOR = "";
export const DIVIDER_STROKE_COLOR = "#00000029";

export const FRAME_TEXT_COLOR = "#718096";
export const FRAME_SELECTED_BORDER_COLOR = "#0BC5EA";
export const FRAME_SELECTED_FILL_COLOR = "#9DECF9";

export const DEFAULT_GRID_OPTIONS: BeadingGridProperties = {
    type: "brick",
    height: 40,
    width: 40,
    drop: 1,
    fringe: 0,
};

export const DEFAULT_GRID: BeadingGridState = {
    name: "",
    rows: [],
    options: DEFAULT_GRID_OPTIONS,
};

export const BEADING_GRID_TYPES: Array<BeadingGridType> = [
    "square",
    "peyote",
    "brick",
];

export const ONE_SIX_BY_ONE_THREE: BeadSize = {
    title: "11/0 (1.6 x 1.3 mm)",
    height: 1.6,
    width: 1.3,
};

export const TWO_ZERO_BY_ONE_FIVE: BeadSize = {
    title: "10/0 (2.0 x 1.5 mm)",
    height: 2.0,
    width: 1.5,
};

export const THREE_ZERO_BY_TWO_FOUR: BeadSize = {
    title: "8/0 (3.0 x 2.4 mm)",
    height: 3.0,
    width: 2.4,
};

export const BEADING_SIZE_OPTIONS: Array<BeadSize> = [
    ONE_SIX_BY_ONE_THREE,
    TWO_ZERO_BY_ONE_FIVE,
    THREE_ZERO_BY_TWO_FOUR,
];

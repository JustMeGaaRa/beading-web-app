import { BeadProperties, ONE_SIX_BY_ONE_THREE } from "./BeadProperties";

export type BeadingGridStyles = {
    rendering: {
        pixelPerPoint: number;
    };
    components: {
        divider: {
            strokeColor: string;
            strokeWidth: number;
        };
    };
    bead: BeadProperties;
};

export const DEFAULT_PIXEL_PER_POINT = 20;
export const DIVIDER_STROKE_COLOR = "#00000029";

export const DefaultGridStyles: BeadingGridStyles = {
    rendering: {
        pixelPerPoint: DEFAULT_PIXEL_PER_POINT,
    },
    components: {
        divider: {
            strokeColor: DIVIDER_STROKE_COLOR,
            strokeWidth: 1,
        },
    },
    bead: ONE_SIX_BY_ONE_THREE,
};

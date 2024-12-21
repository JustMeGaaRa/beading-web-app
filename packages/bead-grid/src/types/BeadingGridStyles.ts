import { BeadProperties, ONE_SIX_BY_ONE_THREE } from "./BeadProperties";

export type BeadingGridStyles = {
    rendering: {
        pixelPerPoint: number;
    };
    bead: BeadProperties;
};

export const DEFAULT_PIXEL_PER_POINT = 20;

export const DefaultGridStyles: BeadingGridStyles = {
    rendering: {
        pixelPerPoint: DEFAULT_PIXEL_PER_POINT,
    },
    bead: ONE_SIX_BY_ONE_THREE,
};

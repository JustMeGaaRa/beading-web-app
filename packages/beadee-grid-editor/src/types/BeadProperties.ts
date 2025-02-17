export type BeadProperties = {
    title: string;
    height: number;
    width: number;
};

export const POINT_PIXEL_RATIO = 20;

export const ONE_SIX_BY_ONE_THREE: BeadProperties = {
    title: "11/0 (1.6 x 1.3 mm)",
    height: 1.6 * 20,
    width: 1.3 * 20,
};

export const TWO_ZERO_BY_ONE_FIVE: BeadProperties = {
    title: "10/0 (2.0 x 1.5 mm)",
    height: 2.0 * POINT_PIXEL_RATIO,
    width: 1.5 * POINT_PIXEL_RATIO,
};

export const THREE_ZERO_BY_TWO_FOUR: BeadProperties = {
    title: "8/0 (3.0 x 2.4 mm)",
    height: 3.0 * POINT_PIXEL_RATIO,
    width: 2.4 * POINT_PIXEL_RATIO,
};

export const BEAD_OPTIONS: Array<BeadProperties> = [
    ONE_SIX_BY_ONE_THREE,
    TWO_ZERO_BY_ONE_FIVE,
    THREE_ZERO_BY_TWO_FOUR,
];

export const flipBead = (bead: BeadProperties): BeadProperties => {
    return {
        ...bead,
        width: bead.height,
        height: bead.width,
    };
};

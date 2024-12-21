export type BeadProperties = {
    title: string;
    height: number;
    width: number;
};

export const ONE_SIX_BY_ONE_THREE: BeadProperties = {
    title: "11/0 (1.6 x 1.3 mm)",
    height: 1.6,
    width: 1.3,
};

export const TWO_ZERO_BY_ONE_FIVE: BeadProperties = {
    title: "10/0 (2.0 x 1.5 mm)",
    height: 2.0,
    width: 1.5,
};

export const THREE_ZERO_BY_TWO_FOUR: BeadProperties = {
    title: "8/0 (3.0 x 2.4 mm)",
    height: 3.0,
    width: 2.4,
};

export const BEAD_OPTIONS: Array<BeadProperties> = [
    ONE_SIX_BY_ONE_THREE,
    TWO_ZERO_BY_ONE_FIVE,
    THREE_ZERO_BY_TWO_FOUR,
];

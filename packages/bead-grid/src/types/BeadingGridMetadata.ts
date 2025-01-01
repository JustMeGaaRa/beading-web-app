import { BeadingGridOffset } from "./BeadingGridBounds";

export type BeadingGridMetadata = {
    offset: BeadingGridOffset;
    divider: {
        offset: BeadingGridOffset;
        length: number;
    };
    text: BeadingGridOffset;
};

import { BeadingGridOffset } from "./BeadingGridOffset";

export type BeadingGridMetadata = {
    offset: BeadingGridOffset;
    divider: {
        offset: BeadingGridOffset;
        length: number;
    };
    text: BeadingGridOffset;
};

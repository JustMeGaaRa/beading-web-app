import { BeadingGridOffset } from "./BeadingGridOffset";
import { BeadingGridRow } from "./BeadingGridRow";

export type BeadingGridSection = {
    offset: BeadingGridOffset;
    height: number;
    width: number;
    rows: Array<BeadingGridRow>;
};

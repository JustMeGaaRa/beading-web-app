import { BeadingGridOffset } from "./BeadingGridBounds";
import { BeadingGridCell } from "./BeadingGridCell";
import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGrid = {
    gridId: string;
    offset: BeadingGridOffset;
    name: string;
    cells: Array<BeadingGridCell>;
    options: BeadingGridProperties;
};

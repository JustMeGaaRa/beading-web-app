import { BeadingGridOffset } from "./BeadingGridBounds";
import { BeadingGridCellState } from "./BeadingGridCellState";
import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridState = {
    gridId: string;
    offset: BeadingGridOffset;
    name: string;
    cells: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
};

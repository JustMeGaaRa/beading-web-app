import { BeadingGridCellState } from "./BeadingGridCellState";
import { BeadingGridOffset } from "./BeadingGridBounds";
import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridState = {
    name: string;
    offset: BeadingGridOffset;
    cells: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
};

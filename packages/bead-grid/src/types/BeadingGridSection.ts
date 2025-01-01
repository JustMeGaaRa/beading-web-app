import { BeadingGridBounds } from "./BeadingGridBounds";
import { BeadingGridCellState } from "./BeadingGridCellState";

export type BeadingGridSection = {
    cells: Array<BeadingGridCellState>;
} & BeadingGridBounds;

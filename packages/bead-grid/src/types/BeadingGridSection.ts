import { BeadingGridOffset, BeadingGridSize } from "./BeadingGridBounds";
import { BeadingGridCellState } from "./BeadingGridCellState";

export type BeadingGridSectionBounds = {
    topLeft: BeadingGridOffset;
} & BeadingGridSize;

export type BeadingGridSection = {
    cells: Array<BeadingGridCellState>;
} & BeadingGridSectionBounds;

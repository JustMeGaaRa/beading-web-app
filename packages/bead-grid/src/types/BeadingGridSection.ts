import { BeadingGridOffset, BeadingGridSize } from "./BeadingGridBounds";
import { BeadingGridCellState } from "./BeadingGridCellState";

export type BeadingGridSectionBounds = {
    topLeft: BeadingGridOffset;
} & BeadingGridSize;

export type BeadingGridSectionState = {
    cells: Array<BeadingGridCellState>;
} & BeadingGridSectionBounds;

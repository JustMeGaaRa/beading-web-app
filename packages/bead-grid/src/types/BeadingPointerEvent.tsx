import { BeadingGridCellState } from "./BeadingGridCellState";

export type BeadingPointerEvent = {
    cell: BeadingGridCellState;
    isPointerDown?: boolean;
};

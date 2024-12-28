import { BeadingGridCellState } from "./BeadingGridCell";

export type BeadingPointerEvent = {
    cell: BeadingGridCellState;
    isPointerDown?: boolean;
};

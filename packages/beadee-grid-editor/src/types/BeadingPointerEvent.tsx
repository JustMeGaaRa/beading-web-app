import { BeadingGridCell } from "./BeadingGridCell";

export type BeadingPointerEvent = {
    cell: BeadingGridCell;
    isPointerDown?: boolean;
};

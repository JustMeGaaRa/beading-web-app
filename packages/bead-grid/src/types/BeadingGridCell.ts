import { BeadingGridOffset } from "./BeadingGridOffset";

export type BeadingGridCellState = {
    color: string;
    offset: BeadingGridOffset;
    isSelected?: boolean;
};

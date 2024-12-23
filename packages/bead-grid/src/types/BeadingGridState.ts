import { BeadingGridCellState } from "./BeadingGridCell";
import { BeadingGridOffset } from "./BeadingGridOffset";
import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridState = {
    name: string;
    offset: BeadingGridOffset;
    cells: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
};

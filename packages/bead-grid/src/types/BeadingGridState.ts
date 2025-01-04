import { BeadingGridCellState } from "./BeadingGridCellState";
import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridState = {
    name: string;
    cells: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
};

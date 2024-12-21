import { BeadingGridCellState } from "./BeadingGridCell";
import { BeadingGridOffset } from "./BeadingGridOffset";
import { BeadingGridProperties } from "./BeadingGridProperties";
import { BeadingGridRow } from "./BeadingGridRow";

export type BeadingGridStateLegacy = {
    name: string;
    rows: Array<BeadingGridRow>;
    options: BeadingGridProperties;
};

export type BeadingGridState = {
    name: string;
    offset: BeadingGridOffset;
    cells: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
};

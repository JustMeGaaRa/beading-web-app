import { BeadingGridProperties } from "./BeadingGridProperties";
import { BeadingGridRow } from "./BeadingGridRow";

export type BeadingGridState = {
    name: string;
    rows: Array<BeadingGridRow>;
    options: BeadingGridProperties;
};

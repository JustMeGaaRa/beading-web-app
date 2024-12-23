import { BeadProperties } from "@repo/bead-grid";
import { PatternSize } from "./PatternSize";

export type BeadSummary = {
    color: string;
    colorName: string;
    number: number;
};

export type PatternSummary = {
    totalBeads: number;
    totalSize: PatternSize;
    beadSize: BeadProperties;
    beads: Array<BeadSummary>;
};

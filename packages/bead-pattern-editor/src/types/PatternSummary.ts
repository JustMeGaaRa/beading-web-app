import { BeadProperties } from "@repo/bead-grid";
import { PatternSize } from "./PatternSize";

export type PatternSummary = {
    totalBeads: number;
    beadSize: BeadProperties;
    totalSize: PatternSize;
    beads: Array<{
        color: string;
        colorName: string;
        number: number;
    }>;
};

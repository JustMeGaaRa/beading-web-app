import { BeadSize } from "@repo/bead-grid";
import { PatternSize } from "./PatternSize";

export type PatternSummary = {
    totalBeads: number;
    beadSize: BeadSize;
    totalSize: PatternSize;
    beads: Array<{
        color: string;
        colorName: string;
        number: number;
    }>;
};

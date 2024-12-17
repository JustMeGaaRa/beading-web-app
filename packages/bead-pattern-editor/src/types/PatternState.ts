import { BeadingGridState } from "@repo/bead-grid";
import { PatternOptions } from "./PatternOptions";
import { PatternVersion } from "./PatternVersion";

export type PatternState = {
    version: PatternVersion;
    patternId: string;
    coverUrl: string;
    lastModified: Date;
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridState>;
    gridCount: number;
};

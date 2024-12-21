import { BeadingGridStateLegacy } from "@repo/bead-grid";
import { PatternOptions } from "./PatternOptions";
import { PatternVersion } from "./PatternVersion";

export type PatternState = {
    version: PatternVersion;
    patternId: string;
    coverUrl: string;
    lastModified: Date;
    name: string;
    options: PatternOptions;
    grids: Array<BeadingGridStateLegacy>;
    gridCount: number;
};

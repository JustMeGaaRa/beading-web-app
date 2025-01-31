import { BeadingGrid } from "@beadee/grid-editor";
import { PatternOptions } from "./PatternOptions";
import { PatternVersion } from "./PatternVersion";

export type PatternState = {
    version: PatternVersion;
    patternId: string;
    name: string;
    coverUrl: string;
    lastModified: Date;
    options: PatternOptions;
    grids: Array<BeadingGrid>;
    gridCount: number;
};

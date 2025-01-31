import { BeadingGrid } from "@beadee/grid-editor";
import { PatternOptions } from "./PatternOptions";

export type Pattern = {
    version: string;
    patternId: string;
    name: string;
    coverUrl: string;
    lastModified: Date;
    options: PatternOptions;
    grids: Array<BeadingGrid>;
    gridCount: number;
};

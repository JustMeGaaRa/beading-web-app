import { isBeadingGrid } from "@beadee/grid-editor";
import { PatternOptions, Pattern } from "../types";

export const isPattern = (data: unknown): data is Pattern => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        "version" in data &&
        "patternId" in data &&
        "name" in data &&
        "coverUrl" in data &&
        "lastModified" in data &&
        "gridCount" in data &&
        "grids" in data &&
        "options" in data &&
        typeof data.version === "string" &&
        typeof data.patternId === "string" &&
        typeof data.coverUrl === "string" &&
        typeof data.lastModified === "string" &&
        typeof data.name === "string" &&
        typeof data.gridCount === "number" &&
        isPatternOptions(data.options) &&
        Array.isArray(data.grids) &&
        data.grids.every((grid: unknown) => isBeadingGrid(grid))
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPatternOptions = (data: unknown): data is PatternOptions => {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    return (
        "type" in data &&
        "width" in data &&
        "height" in data &&
        "orientation" in data &&
        typeof data.type === "string" &&
        typeof data.width === "number" &&
        typeof data.height === "number" &&
        typeof data.orientation === "string"
    );
};

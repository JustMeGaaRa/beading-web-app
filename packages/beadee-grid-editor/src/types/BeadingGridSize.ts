import { BeadingGridProperties } from "./BeadingGridProperties";

export type BeadingGridSize = {
    height: number;
    width: number;
};

export const getGridHeight = (options: BeadingGridProperties) => {
    return options.type === "brick"
        ? options.height + options.fringe
        : options.height;
};

export const getGridSize = (
    options: BeadingGridProperties
): BeadingGridSize => {
    return {
        height: getGridHeight(options),
        width: options.width,
    };
};

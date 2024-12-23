import { BeadingGridOffset, BeadingGridProperties } from "../types";
import { capitalize } from "./common";

export const areEqualDeep = (
    left: BeadingGridProperties,
    right: BeadingGridProperties
) => {
    return JSON.stringify(left) === JSON.stringify(right);
};

export const isInBounds = (
    options: BeadingGridProperties,
    offset: BeadingGridOffset
) => {
    if (options.type === "brick") {
        return (
            offset.rowIndex >= 0 &&
            offset.columnIndex >= 0 &&
            offset.rowIndex < options.height + options.fringe &&
            offset.columnIndex < options.width
        );
    }

    return (
        offset.rowIndex >= 0 &&
        offset.columnIndex >= 0 &&
        offset.rowIndex < options.height &&
        offset.columnIndex < options.width
    );
};

export const getGridActualHeight = (options: BeadingGridProperties) => {
    return options.type === "brick"
        ? options.height + options.fringe
        : options.height;
};

export const getGridSize = (options: BeadingGridProperties) => {
    return {
        height:
            options.type === "brick"
                ? options.height + options.fringe
                : options.height,
        width: options.width,
    };
};

export const getGridNumber = (name: string) => {
    const numbersInName = name
        .split(" ")
        .map((word) => Number(word))
        .filter((word) => Number.isInteger(word));
    const lasteGridNumber = numbersInName.length > 0 ? numbersInName[0]! : 1;
    return lasteGridNumber;
};

export const buildGridName = (
    options: BeadingGridProperties,
    gridCount: number = 1
) => {
    return `${capitalize(options.type)} Grid ${gridCount}`;
};

export const restoreGridName = (
    options: BeadingGridProperties,
    currentName: string
) => {
    const lasteGridNumber = getGridNumber(currentName);
    return buildGridName(options, lasteGridNumber);
};

export const nextGridName = (
    options: BeadingGridProperties,
    currentName: string
) => {
    const lasteGridNumber = getGridNumber(currentName);
    return buildGridName(options, lasteGridNumber + 1);
};

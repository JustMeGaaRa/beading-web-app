import { BrickGridProperties } from "./BrickGridProperties";
import { PeyoteGridProperties } from "./PeyoteGridProperties";
import { SquareGridProperties } from "./SquareGridProperties";

export const DefaultGridProperties: BrickGridProperties = {
    type: "brick",
    height: 40,
    width: 40,
    drop: 1,
    fringe: 0,
};

export type BeadingGridProperties =
    | SquareGridProperties
    | PeyoteGridProperties
    | BrickGridProperties;

export function isSquareGridProperties(
    properties: BeadingGridProperties
): properties is SquareGridProperties {
    return (
        properties.type === "square" &&
        "height" in properties &&
        "width" in properties
    );
}

export function isPeyoteGridProperties(
    properties: BeadingGridProperties
): properties is PeyoteGridProperties {
    return (
        properties.type === "peyote" &&
        "height" in properties &&
        "width" in properties
    );
}

export function isBrickGridProperties(
    properties: BeadingGridProperties
): properties is BrickGridProperties {
    return (
        properties.type === "brick" &&
        "height" in properties &&
        "width" in properties &&
        "drop" in properties &&
        "fringe" in properties
    );
}

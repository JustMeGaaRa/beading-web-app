import { BrickGridProperties } from "./BrickGridProperties";
import { PeyoteGridProperties } from "./PeyoteGridProperties";
import { SquareGridProperties } from "./SquareGridProperties";

export type BeadingGridProperties =
    | SquareGridProperties
    | PeyoteGridProperties
    | BrickGridProperties;

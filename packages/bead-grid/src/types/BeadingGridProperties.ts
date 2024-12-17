import { BrickGridProperties } from "./BrickGridProperties";
import { PeyoteGridProperties } from "./PeyoteGridProperties";
import { SquareGridProperties } from "./SquareGridProperties";
import { BeadSize } from "./BeadSize";
import { LayoutOrientation } from "./LayoutOrientation";

export type BeadingGridLayoutProperties = {
    beadSize: BeadSize;
    orientation: LayoutOrientation;
};

export type BeadingGridProperties = BeadingGridLayoutProperties &
    (SquareGridProperties | PeyoteGridProperties | BrickGridProperties);

import { BeadingGridBounds, BeadingGridState } from "../types";

export type FlipDirection = "horizontal" | "vertical";

export const gridFlipSectionReducer = (
    grid: BeadingGridState,
    section: BeadingGridBounds,
    direction: FlipDirection
): BeadingGridState => {
    console.log(grid);
    console.log(section);
    console.log(direction);
    throw new Error("Not implemented");
};

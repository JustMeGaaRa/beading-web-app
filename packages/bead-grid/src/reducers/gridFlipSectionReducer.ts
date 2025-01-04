import { BeadingGridSectionBounds, BeadingGridState } from "../types";

export type FlipDirection = "horizontal" | "vertical";

export const gridFlipSectionReducer = (
    grid: BeadingGridState,
    section: BeadingGridSectionBounds,
    direction: FlipDirection
): BeadingGridState => {
    console.log(grid);
    console.log(section);
    console.log(direction);
    throw new Error("Not implemented");
};

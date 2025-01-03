import { BeadingGridState } from "../types";

export type MoveDirection = "up" | "down" | "left" | "right";

export const gridMoveSectionReducer = (
    grid: BeadingGridState
): BeadingGridState => {
    console.log(grid);
    throw new Error("Not implemented");
};

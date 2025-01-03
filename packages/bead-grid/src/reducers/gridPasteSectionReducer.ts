import { BeadingGridOffset, BeadingGridState } from "../types";

export const gridPasteSectionReducer = (
    grid: BeadingGridState,
    section: BeadingGridState,
    offset: BeadingGridOffset
): BeadingGridState => {
    console.log(grid);
    console.log(section);
    console.log(offset);
    throw new Error("Not implemented");
};

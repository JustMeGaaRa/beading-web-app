import { BeadingGridOffset, BeadingGridSection } from "../types";
import { shift } from "./grid";

export const createSectionDragContext = (section: BeadingGridSection) => {
    const originalSection = { ...section } satisfies BeadingGridSection;
    let clonedSection = { ...section } satisfies BeadingGridSection;

    const accept = (): BeadingGridSection => {
        return clonedSection;
    };

    const cancel = (): BeadingGridSection => {
        return originalSection;
    };

    const move = (offset: BeadingGridOffset): BeadingGridSection => {
        clonedSection = shift(clonedSection, offset);
        return clonedSection;
    };

    return {
        accept,
        cancel,
        move,
    };
};

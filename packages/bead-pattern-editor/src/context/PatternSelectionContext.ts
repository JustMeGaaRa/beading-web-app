import { BeadingGridCell } from "@repo/bead-grid";
import { createContext, Dispatch, SetStateAction } from "react";

export const PatternSelectionContext = createContext<{
    selectedCells: Record<string, Array<BeadingGridCell>>;
    selectedColumn: number;
    selectedRow: number;
    setSelectedCells: Dispatch<
        SetStateAction<Record<string, Array<BeadingGridCell>>>
    >;
    setSelectedColumn: Dispatch<SetStateAction<number>>;
    setSelectedRow: Dispatch<SetStateAction<number>>;
}>({
    selectedCells: {},
    selectedColumn: -1,
    selectedRow: -1,
    setSelectedCells: () => {},
    setSelectedColumn: () => {},
    setSelectedRow: () => {},
});

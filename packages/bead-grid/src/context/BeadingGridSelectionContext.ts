import { BeadingGridCellState } from "@repo/bead-grid";
import { createContext, Dispatch, SetStateAction } from "react";

export const BeadingGridSelectionContext = createContext<{
    selectedCells: Record<string, Array<BeadingGridCellState>>;
    selectedColumn: number;
    selectedRow: number;
    setSelectedCells: Dispatch<
        SetStateAction<Record<string, Array<BeadingGridCellState>>>
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

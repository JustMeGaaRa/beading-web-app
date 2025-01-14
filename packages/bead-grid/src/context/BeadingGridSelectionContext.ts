import { BeadingGridCellState } from "@repo/bead-grid";
import { createContext, Dispatch, SetStateAction } from "react";

export const BeadingGridSelectionContext = createContext<{
    cliboardCells: Array<BeadingGridCellState>;
    selectedCells: Array<BeadingGridCellState>;
    selectedColumn: number;
    selectedRow: number;
    setClipboardCells: Dispatch<SetStateAction<Array<BeadingGridCellState>>>;
    setSelectedCells: Dispatch<SetStateAction<Array<BeadingGridCellState>>>;
    setSelectedColumn: Dispatch<SetStateAction<number>>;
    setSelectedRow: Dispatch<SetStateAction<number>>;
}>({
    cliboardCells: [],
    selectedCells: [],
    selectedColumn: -1,
    selectedRow: -1,
    setClipboardCells: () => {},
    setSelectedCells: () => {},
    setSelectedColumn: () => {},
    setSelectedRow: () => {},
});

import { BeadingGridCell } from "@beadee/grid-editor";
import { createContext, Dispatch, SetStateAction } from "react";

export const BeadingGridSelectionContext = createContext<{
    cliboardCells: Record<string, Array<BeadingGridCell>>;
    selectedCells: Record<string, Array<BeadingGridCell>>;
    selectedColumn: number;
    selectedRow: number;
    setClipboardCells: Dispatch<
        SetStateAction<Record<string, Array<BeadingGridCell>>>
    >;
    setSelectedCells: Dispatch<
        SetStateAction<Record<string, Array<BeadingGridCell>>>
    >;
    setSelectedColumn: Dispatch<SetStateAction<number>>;
    setSelectedRow: Dispatch<SetStateAction<number>>;
}>({
    cliboardCells: {},
    selectedCells: {},
    selectedColumn: -1,
    selectedRow: -1,
    setClipboardCells: () => {},
    setSelectedCells: () => {},
    setSelectedColumn: () => {},
    setSelectedRow: () => {},
});

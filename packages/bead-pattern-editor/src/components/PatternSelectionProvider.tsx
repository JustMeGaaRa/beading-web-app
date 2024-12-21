import { BeadingGridCellState } from "@repo/bead-grid";
import { FC, PropsWithChildren, useState } from "react";
import { PatternSelectionContext } from "../context";

export const PatternSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [selectedCells, setSelectedCells] = useState<Record<string, Array<BeadingGridCellState>>>({});
    const [selectedColumn, setSelectedColumn] = useState(-1);
    const [selectedRow, setSelectedRow] = useState(-1);

    return (
        <PatternSelectionContext.Provider value={{
            selectedCells,
            selectedColumn,
            selectedRow,
            setSelectedCells,
            setSelectedColumn,
            setSelectedRow,
        }}>
            {children}
        </PatternSelectionContext.Provider>
    );
};

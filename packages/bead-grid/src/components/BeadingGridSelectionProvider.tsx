import { BeadingGridCellState } from "@repo/bead-grid";
import { FC, PropsWithChildren, useState } from "react";
import { BeadingGridSelectionContext } from "../context";

export const BeadingGridSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [selectedCells, setSelectedCells] = useState<Record<string, Array<BeadingGridCellState>>>({});
    const [selectedColumn, setSelectedColumn] = useState(-1);
    const [selectedRow, setSelectedRow] = useState(-1);

    return (
        <BeadingGridSelectionContext.Provider value={{
            selectedCells,
            selectedColumn,
            selectedRow,
            setSelectedCells,
            setSelectedColumn,
            setSelectedRow,
        }}>
            {children}
        </BeadingGridSelectionContext.Provider>
    );
};

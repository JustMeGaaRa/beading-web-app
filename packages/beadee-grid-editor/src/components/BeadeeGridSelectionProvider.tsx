import { BeadingGridCell } from "@beadee/grid-editor";
import { FC, PropsWithChildren, useState } from "react";
import { BeadingGridSelectionContext } from "../context";

export const BeadeeGridSelectionProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const [cliboardCells, setClipboardCells] = useState<
        Record<string, Array<BeadingGridCell>>
    >({});
    const [selectedCells, setSelectedCells] = useState<
        Record<string, Array<BeadingGridCell>>
    >({});
    const [selectedColumn, setSelectedColumn] = useState(-1);
    const [selectedRow, setSelectedRow] = useState(-1);

    return (
        <BeadingGridSelectionContext.Provider
            value={{
                cliboardCells,
                selectedCells,
                selectedColumn,
                selectedRow,
                setClipboardCells,
                setSelectedCells,
                setSelectedColumn,
                setSelectedRow,
            }}
        >
            {children}
        </BeadingGridSelectionContext.Provider>
    );
};

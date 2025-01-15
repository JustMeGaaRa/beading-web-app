import { BeadingGridCellState } from "@repo/bead-grid";
import { FC, PropsWithChildren, useState } from "react";
import {
    BeadingGridSelectionContext,
    BeadingGridSelectionFrameContext,
} from "../context";

export const BeadingGridSelectionProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const [cliboardCells, setClipboardCells] = useState<
        Array<BeadingGridCellState>
    >([]);
    const [selectedCells, setSelectedCells] = useState<
        Array<BeadingGridCellState>
    >([]);
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

export const BeadingGridSelectionFrameProvider: FC<PropsWithChildren> = ({
    children,
}) => {
    const [mouseDownPosition, setMouseDownPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(undefined);
    const [mouseCurrentPosition, setMouseCurrentPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(undefined);

    return (
        <BeadingGridSelectionFrameContext.Provider
            value={{
                mouseDownPosition,
                mouseCurrentPosition,
                setMouseDownPosition,
                setMouseCurrentPosition,
            }}
        >
            {children}
        </BeadingGridSelectionFrameContext.Provider>
    );
};

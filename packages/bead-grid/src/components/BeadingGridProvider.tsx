import { FC, PropsWithChildren, useState } from "react";
import { BeadingGridContext } from "../context";
import { BeadingGridCellState, BeadingGridProperties, DefaultGridProperties } from "../types";

export const BeadingGridProvider: FC<PropsWithChildren> = ({ children }) => {
    const [cells, setCells] = useState<Array<BeadingGridCellState>>([]);
    const [offset, setOffset] = useState({ rowIndex: 0, columnIndex: 0 });
    const [options, setOptions] = useState<BeadingGridProperties>(DefaultGridProperties);

    return (
        <BeadingGridContext.Provider value={{ cells, offset, options, setCells, setOffset, setOptions }}>
            {children}
        </BeadingGridContext.Provider>
    );
};

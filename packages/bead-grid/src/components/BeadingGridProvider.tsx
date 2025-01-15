import { FC, PropsWithChildren, useState } from "react";
import { BeadingGridContext } from "../context";
import {
    BeadingGridCellState,
    BeadingGridProperties,
    DefaultGridProperties,
} from "../types";

export const BeadingGridProvider: FC<PropsWithChildren> = ({ children }) => {
    const [gridId, setGridId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [cells, setCells] = useState<Array<BeadingGridCellState>>([]);
    const [offset, setOffset] = useState({ rowIndex: 0, columnIndex: 0 });
    const [options, setOptions] = useState<BeadingGridProperties>(
        DefaultGridProperties
    );

    return (
        <BeadingGridContext.Provider
            value={{
                gridId,
                name,
                cells,
                offset,
                options,
                setGridId,
                setName,
                setCells,
                setOffset,
                setOptions,
            }}
        >
            {children}
        </BeadingGridContext.Provider>
    );
};

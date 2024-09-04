import { FC, PropsWithChildren, useState } from "react";
import { DefaultPatternOptions } from "./constants";
import { PatternContext } from "./context";
import { BeadingGridState, PatternOptions } from "./types";

export const PatternProvider: FC<PropsWithChildren> = ({ children }) => {
    const [name, setName] = useState<string>("Untitled pattern");
    const [options, setOptions] = useState<PatternOptions>(DefaultPatternOptions);
    const [grids, setGrids] = useState<Array<BeadingGridState>>([]);
    const [gridCount, setGridCount] = useState(0);

    return (
        <PatternContext.Provider
            value={{
                name,
                options,
                grids,
                gridCount,
                setName,
                setOptions,
                setGrids,
                setGridCount,
            }}
        >
            {children}
        </PatternContext.Provider>
    );
};

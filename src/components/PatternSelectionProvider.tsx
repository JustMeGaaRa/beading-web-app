import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from "react";

const PatternSelectionContext = createContext<{
    selectedCells: Array<{ row: number; column: number }>;
    selectedColumn: number;
    selectedRow: number;
    setSelectedCells: Dispatch<SetStateAction<Array<{ row: number; column: number }>>>;
    setSelectedColumn: Dispatch<SetStateAction<number>>;
    setSelectedRow: Dispatch<SetStateAction<number>>;
}>({
    selectedCells: [],
    selectedColumn: -1,
    selectedRow: -1,
    setSelectedCells: () => {},
    setSelectedColumn: () => {},
    setSelectedRow: () => {},
});

export const PatternSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [selectedCells, setSelectedCells] = useState<Array<{ row: number; column: number }>>([]);
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

export const usePatternSelection = () => {
    return useContext(PatternSelectionContext);
};

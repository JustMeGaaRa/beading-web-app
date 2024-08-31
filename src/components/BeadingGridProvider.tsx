import {
  createContext,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { BeadingGridState, DefaultBeadingGrid } from "./PatternProvider";

const BeadingGridContext = createContext<{
  grid: BeadingGridState;
  setGrid: React.Dispatch<SetStateAction<BeadingGridState>>;
}>({
  grid: DefaultBeadingGrid,
  setGrid: () => {},
});

export const BeadingGridProvider: FC<PropsWithChildren> = ({ children }) => {
  const [grid, setGrid] = useState<BeadingGridState>(DefaultBeadingGrid);

  return (
    <BeadingGridContext.Provider value={{ grid, setGrid }}>
      {children}
    </BeadingGridContext.Provider>
  );
};

export type BeadingGridCellState = {
  row: number;
  column: number;
  color: string;
};

export const useBeadingGrid = () => {
  const { grid, setGrid } = useContext(BeadingGridContext);

  const setCellColor = useCallback(
    (cell: BeadingGridCellState) => {
      setGrid((grid) => ({
        ...grid,
        rows: grid.rows.map((gridRow, rowIndex) => ({
          cells: gridRow.cells.map((gridCell, columnIndex) =>
            rowIndex === cell.row && columnIndex === cell.column
              ? cell.color
              : gridCell
          ),
        })),
      }));
    },
    [setGrid]
  );

  return {
    grid,
    setGrid,
    setCellColor,
  };
};

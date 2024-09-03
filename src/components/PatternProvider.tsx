import {
  createContext,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { createBeadingGrid, isNullOrEmpty } from "../utils";

// SECTION: pattern

export type LayoutOrientation = "vertical" | "horizontal";

export type BeadSize = {
  title: string;
  height: number;
  width: number;
};

export type PatternLayoutOptions = {
  beadSize: BeadSize;
  orientation: LayoutOrientation;
  height: number;
  width: number;
};

export type PatternOptions = {
  layout: PatternLayoutOptions;
};

export type PatternState = {
  name: string;
  options: PatternOptions;
  grids: Array<BeadingGridState>;
};

export type PatternSummary = {
  totalBeads: number;
  beadSize: BeadSize;
  totalSize: BeadSize;
  beads: Array<{
    color: string;
    colorName: string;
    number: number;
  }>;
};

export const OneSixByOneThree: BeadSize = {
  title: "11/0 (1.6 x 1.3 mm)",
  height: 1.6,
  width: 1.3,
};

export const BeadSizeOptions: Array<BeadSize> = [OneSixByOneThree];

export const DefaultPatternOptions: PatternOptions = {
  layout: {
    beadSize: OneSixByOneThree,
    orientation: "horizontal",
    height: 10,
    width: 10,
  },
};

// SECTION: grid

export type BeadingGridType = "square" | "peyote" | "brick";

export type SquareGridProperties = {
  type: "square";
  height: number;
  width: number;
};

export type PeyoteGridProperties = {
  type: "peyote";
  height: number;
  width: number;
};

export type BrickGridProperties = {
  type: "brick";
  height: number;
  width: number;
  fringe: number;
  drop: number;
};

export type BeadingGridProperties =
  | SquareGridProperties
  | PeyoteGridProperties
  | BrickGridProperties;

export type BeadingGridRow = {
  cells: Array<string>;
};

export type BeadingGridState = {
  name: string;
  rows: Array<BeadingGridRow>;
  options: BeadingGridProperties;
};

export const DefaultBeadingGrid: BeadingGridState = {
  name: "",
  rows: [],
  options: {
    type: "square",
    height: 0,
    width: 0,
  },
};

export const BeadingGridTypes: Array<BeadingGridType> = [
  "square",
  "peyote",
  "brick",
];

const PatternContext = createContext<{
  name: string;
  options: PatternOptions;
  grids: Array<BeadingGridState>;
  gridCount: number;
  setName: React.Dispatch<SetStateAction<string>>;
  setOptions: React.Dispatch<SetStateAction<PatternOptions>>;
  setGrids: React.Dispatch<SetStateAction<Array<BeadingGridState>>>;
  setGridCount: React.Dispatch<SetStateAction<number>>;
}>({
  name: "Untitled pattern",
  options: DefaultPatternOptions,
  grids: [],
  gridCount: 0,
  setName: () => {},
  setOptions: () => {},
  setGrids: () => {},
  setGridCount: () => {},
});

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

export const usePattern = () => {
  const {
    name,
    grids,
    options,
    gridCount,
    setName,
    setGrids,
    setOptions,
    setGridCount,
  } = useContext(PatternContext);

  const resetGrids = useCallback((type: BeadingGridType) => {
      const grid = createBeadingGrid(
        "Grid 1",
        {
          type: type,
          height: 20,
          width: 20,
          drop: 1,
          fringe: 0,
        },
        options
      );
      setGrids([grid]);
      setGridCount(1);
    },
    [gridCount, setGrids, setGridCount]
  );

  const addGrid = useCallback((type: BeadingGridType) => {
      const grid = createBeadingGrid(
        `Grid ${gridCount + 1}`,
        {
          type: type,
          height: 20,
          width: 20,
          drop: 1,
          fringe: 0,
        },
        options
      );
      setGrids((grids) => [...grids, grid]);
      setGridCount((count) => count + 1);
    },
    [gridCount, options, setGrids, setGridCount]
  );

  const getSummary = useCallback((): PatternSummary => {
    const beadItems = new Map<string, number>();
    grids.forEach((gridState) => {
      gridState.rows.forEach((rowState) => {
        rowState.cells
          .filter((cell) => !isNullOrEmpty(cell))
          .forEach((cell) =>
            beadItems.set(cell, (beadItems.get(cell) || 0) + 1)
          );
      });
    });
    const beads = Array.from(beadItems.keys()).map((key) => ({
      color: key,
      colorName: key,
      number: beadItems.get(key) || 0,
    }));
    const totalBeads = grids.reduce((patternTotal, gridState) => {
      const gridTotal = gridState.rows.reduce((gridTotal, rowState) => {
        const rowTotal = rowState.cells.filter(
          (cell) => !isNullOrEmpty(cell)
        ).length;
        return gridTotal + rowTotal;
      }, 0);
      return patternTotal + gridTotal;
    }, 0);
    const totalHeight =
      options.layout.orientation === "vertical"
        ? grids
            .reduce((totalHeight, gridState) =>
              totalHeight + gridState.options.height * options.layout.beadSize.height,
              0
            )
        : grids
            .map((gridState) => gridState.rows.length)
            .reduce((max, height) =>
              max > height ? max : height * options.layout.beadSize.height,
              0
            );
    const totalWidth =
      options.layout.orientation === "vertical"
        ? options.layout.width
        : options.layout.width * grids.length * options.layout.beadSize.width;
    const totalSize: BeadSize = {
      title: `${totalHeight.toFixed(2)} x ${totalWidth.toFixed(2)} mm`,
      height: totalHeight,
      width: totalWidth,
    };

    return {
      totalBeads,
      beadSize: options.layout.beadSize,
      totalSize,
      beads,
    };
  }, [grids, options]);

  return {
    name,
    grids,
    options,
    setName,
    setGrids,
    setOptions,
    addGrid,
    resetGrids,
    getSummary,
  };
};

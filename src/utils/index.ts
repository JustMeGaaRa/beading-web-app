import {
  BeadingGridState,
  BeadingGridProperties,
  PatternLayoutOptions,
  BeadingGridCellState,
} from "../components";
import { CellBlankColor } from "../constants";

export const createBeadingGrid = (
  name: string,
  options: BeadingGridProperties,
  layout: PatternLayoutOptions
): BeadingGridState => {
  switch (options.type) {
    case "square":
      return {
        name: name,
        rows: Array.from({ length: options.height }, () => ({
          cells: Array.from({ length: layout.width }, () => CellBlankColor),
        })),
        options: options,
      };
    case "peyote":
      return {
        name: name,
        rows: Array.from({ length: options.height }, () => ({
          cells: Array.from({ length: layout.width }, () => CellBlankColor),
        })),
        options: options,
      };
    case "brick":
      return {
        name: name,
        rows: Array.from({ length: options.height }, () => ({
          cells: Array.from({ length: layout.width }, () => CellBlankColor),
        })),
        options: options,
      };
  }
};

export const setGridCell = (
  grid: BeadingGridState,
  cell: BeadingGridCellState
): BeadingGridState => {
  return {
    ...grid,
    rows: grid.rows.map((gridRow, rowIndex) => ({
      cells: gridRow.cells.map((gridCell, columnIndex) =>
        rowIndex === cell.row && columnIndex === cell.column
          ? cell.color
          : gridCell
      ),
    })),
  };
};

export const applyGridOptions = (
  grid: BeadingGridState,
  options: BeadingGridProperties,
  layout: PatternLayoutOptions
): BeadingGridState => {
  const modifiedGrid = createBeadingGrid(grid.name, options, layout);
  const minWidth = Math.min(
    grid.rows[0].cells.length,
    modifiedGrid.rows[0].cells.length
  );
  const minHeight = Math.min(grid.rows.length, modifiedGrid.rows.length);

  for (let row = 0; row < minHeight; row++) {
    for (let column = 0; column < minWidth; column++) {
      modifiedGrid.rows[row].cells[column] = grid.rows[row].cells[column];
    }
  }

  return modifiedGrid;
};

export const isNullOrEmpty = (str?: string) =>
  str === null || str === undefined || str === "";

export const deepClone = <T>(instance: T): T => {
  return JSON.parse(JSON.stringify(instance)) as T;
};

export const toJsonUri = (instance: any) => {
  const patternJson = JSON.stringify(instance, null, 2);
  const blob = new Blob([patternJson], { type: "application/json" });
  return URL.createObjectURL(blob);
};

export const downloadUri = (uri: string, name: string) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

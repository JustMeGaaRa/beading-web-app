export type BeadSize = {
  title: string;
  height: number;
  width: number;
};

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

export type BeadingGridOffset = {
  columnIndex: number;
  rowIndex: number;
};

export type BeadingGridRow = {
  cells: Array<string>;
};

export type BeadingGridCell = {
  color: string;
  offset: BeadingGridOffset;
};

export type BeadingGridState = {
  name: string;
  rows: Array<BeadingGridRow>;
  options: BeadingGridProperties;
};

export type BeadingGridMetadata = {
  offset: BeadingGridOffset;
  divider: {
    offset: BeadingGridOffset;
    length: number;
  };
  text: BeadingGridOffset;
};

export type BeadingGridWindow = {
  offset: BeadingGridOffset;
  height: number;
  width: number;
};

export type BeadingGridSection = {
  offset: BeadingGridOffset;
  height: number;
  width: number;
  rows: Array<BeadingGridRow>;
};

export type BeadingGridRectangle = {
  position: { x: number; y: number };
  width: number;
  height: number;
};

import {
  clearGridColumn,
  clearGridRow,
  DEFAULT_GRID_OPTIONS,
  deleteGridColumn,
  deleteGridRow,
  insertGridColumn,
  insertGridRow,
  setGridCell,
  mirrorSection,
  dulicateSection,
  clearSection,
} from "../beading-grid";
import { PatternActions } from "./actions";
import { PatternState } from "./types";
import {
  applyBeadingGridOptions,
  applyPatternOptions,
  changePatternColor,
  createGrid,
} from "./utils";

export const patternReducer = (
  state: PatternState,
  action: PatternActions
): PatternState => {
  switch (action.type) {
    case "PATTERN_CHANGE_NAME":
      return {
        ...state,
        lastModified: new Date(),
        name: action.payload.name,
      };
    case "PATTERN_CHANGE_COLOR":
      return changePatternColor(
        state,
        action.payload.oldColor,
        action.payload.newColor
      );
    case "PATTERN_APPLY_OPTIONS":
      return applyPatternOptions(state, action.payload.options);
    case "BEADING_GRID_ADD":
      return {
        ...state,
        lastModified: new Date(),
        grids: [
          ...state.grids,
          createGrid(
            state.gridCount,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { ...DEFAULT_GRID_OPTIONS, type: state.options.layout.type } as any,
            state.options
          ),
        ],
        gridCount: state.gridCount + 1,
      };
    case "BEADING_GRID_DELETE":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.filter((grid) => grid.name !== action.payload.name),
      };
    case "BEADING_GRID_SET_CELL":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          grid.name === action.payload.name
            ? setGridCell(grid, action.payload.cell)
            : grid
        ),
      };
    case "BEADING_GRID_APPLY_OPTIONS":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          grid.name === action.payload.name
            ? applyBeadingGridOptions(
                grid,
                action.payload.options,
                state.options
              )
            : grid
        ),
      };
    case "BEADING_GRID_ADD_COLUMN_BEFORE":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? insertGridColumn(grid, action.payload.column)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            width:
              action.payload.name === "all"
                ? state.options.layout.width + 1
                : state.options.layout.width,
          },
        },
      };
    case "BEADING_GRID_ADD_COLUMN_AFTER":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? insertGridColumn(grid, action.payload.column + 1)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            width:
              action.payload.name === "all"
                ? state.options.layout.width + 1
                : state.options.layout.width,
          },
        },
      };
    case "BEADING_GRID_DELETE_COLUMN":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? deleteGridColumn(grid, action.payload.column)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            width:
              action.payload.name === "all"
                ? state.options.layout.width - 1
                : state.options.layout.width,
          },
        },
      };
    case "BEADING_GRID_CLEAR_COLUMN":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? clearGridColumn(grid, action.payload.column)
            : grid
        ),
      };
    case "BEADING_GRID_ADD_ROW_BEFORE":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? insertGridRow(grid, action.payload.row)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            height:
              action.payload.name === "all"
                ? state.options.layout.height + 1
                : state.options.layout.height,
          },
        },
      };
    case "BEADING_GRID_ADD_ROW_AFTER":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? insertGridRow(grid, action.payload.row + 1)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            height:
              action.payload.name === "all"
                ? state.options.layout.height + 1
                : state.options.layout.height,
          },
        },
      };
    case "BEADING_GRID_DELETE_ROW":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? deleteGridRow(grid, action.payload.row)
            : grid
        ),
        options: {
          ...state.options,
          layout: {
            ...state.options.layout,
            height:
              action.payload.name === "all"
                ? state.options.layout.height - 1
                : state.options.layout.height,
          },
        },
      };
    case "BEADING_GRID_CLEAR_ROW":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          action.payload.name === "all" || grid.name === action.payload.name
            ? clearGridRow(grid, action.payload.row)
            : grid
        ),
      };
    case "BEADING_GRID_MIRROR_SECTION":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          grid.name === action.payload.name
            ? mirrorSection(
                grid,
                action.payload.target,
                action.payload.source,
                "horizontal"
              )
            : grid
        ),
      };
    case "BEADING_GRID_DUPLICATE_SECTION":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          grid.name === action.payload.name
            ? dulicateSection(
                grid,
                action.payload.target,
                action.payload.source
              )
            : grid
        ),
      };
    case "BEADING_GRID_CLEAR_SECTION":
      return {
        ...state,
        lastModified: new Date(),
        grids: state.grids.map((grid) =>
          grid.name === action.payload.name ? clearSection(grid) : grid
        ),
      };
    default:
      return state;
  }
};

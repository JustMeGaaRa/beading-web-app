import { PatternActions } from "./actions";
import { DefaultGridOptions } from "./constants";
import { PatternState } from "./types";
import { applyBeadingGridOptions, applyPatternOptions, changePatternColor, clearGridColumn, clearGridRow, createBeadingGrid, deleteGridColumn, deleteGridRow, insertGridColumn, insertGridRow, setBeadingGridCell } from "./utils";

export const patternReducer = (state: PatternState, action: PatternActions): PatternState => {
    switch (action.type) {
        case "setPattern":
            return { ...action.payload.pattern };
        case "setPatternName":
            return { ...state, name: action.payload.name };
        case "setPatternCover":
            return { ...state, coverUrl: action.payload.coverUrl };
        case "changePatternColor":
            return changePatternColor(
                state,
                action.payload.oldColor,
                action.payload.newColor
            );
        case "applyPatternOptions":
            return applyPatternOptions(
                state,
                action.payload.options
            );
        case "addGrid":
            return {
                ...state,
                grids: [
                    ...state.grids,
                    createBeadingGrid(state.gridCount, DefaultGridOptions, state.options)
                ],
                gridCount: state.gridCount + 1
            };
        case "deleteGrid":
            return {
                ...state,
                grids: state.grids.filter((grid) => grid.name !== action.payload.name)
            };
        case "setGridCellColor":
            return {
                ...state,
                grids: state.grids.map((grid) => grid.name === action.payload.name
                    ? setBeadingGridCell(grid, action.payload.cell)
                    : grid
                )
            };
        case "applyGridOptions":
            return {
                ...state,
                grids: state.grids.map((grid) => grid.name === action.payload.name
                    ? applyBeadingGridOptions(grid, action.payload.options, state.options)
                    : grid
                )
            };
        case "addGridRowAbove":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? insertGridRow(grid, action.payload.row)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        height: action.payload.name === "all"
                            ? state.options.layout.height + 1
                            : state.options.layout.height
                    }
                }
            };
        case "addGridRowBelow":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? insertGridRow(grid, action.payload.row + 1)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        height: action.payload.name === "all"
                            ? state.options.layout.height + 1
                            : state.options.layout.height
                    }
                }
            };
        case "deleteGridRow":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? deleteGridRow(grid, action.payload.row)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        height: action.payload.name === "all"
                            ? state.options.layout.height - 1
                            : state.options.layout.height
                    }
                }
            };
        case "clearGridRow":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? clearGridRow(grid, action.payload.row)
                        : grid
                )
            };
        case "addGridColumnLeft":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? insertGridColumn(grid, action.payload.column)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        width: action.payload.name === "all"
                            ? state.options.layout.width + 1
                            : state.options.layout.width
                    }
                }
            };
        case "addGridColumnRight":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? insertGridColumn(grid, action.payload.column + 1)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        width: action.payload.name === "all"
                            ? state.options.layout.width + 1
                            : state.options.layout.width
                    }
                }
            };
        case "deleteGridColumn":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? deleteGridColumn(grid, action.payload.column)
                        : grid
                ),
                options: {
                    ...state.options,
                    layout: {
                        ...state.options.layout,
                        width: action.payload.name === "all"
                            ? state.options.layout.width - 1
                            : state.options.layout.width
                    }
                }
            };
        case "clearGridColumn":
            return {
                ...state,
                grids: state.grids.map((grid) => 
                    action.payload.name === "all" || grid.name === action.payload.name
                        ? clearGridColumn(grid, action.payload.column)
                        : grid
                )
            };
        default:
            return state;
    }
};

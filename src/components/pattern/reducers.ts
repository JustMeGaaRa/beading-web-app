import throttle from "just-throttle";
import { ApplyGridOptionsAction, ApplyPatternOptionsAction, PatternActions } from "./actions";
import { DefaultPatternOptions } from "./constants";
import { PatternState, SquareGridProperties } from "./types";
import { applyGridOptions, createBeadingGrid, setGridCell } from "./utils";

export const patternReducer = (state: PatternState, action: PatternActions): PatternState => {
    switch (action.type) {
        case "setName":
            return { ...state, name: action.payload.name };
        case "setGridCellColor":
            return {
                ...state,
                grids: state.grids.map((grid) => grid.name === action.payload.name
                    ? setGridCell(grid, action.payload.cell)
                    : grid
                )
            }
        case "addGrid":
            const options = {
                type: "square",
                height: 10,
                width: 10,
                drop: 1,
                fringe: 0,
            } as SquareGridProperties;
            const grid = createBeadingGrid(`Grid ${state.gridCount + 1}`, options, state.options);
            return {
                ...state,
                grids: [...state.grids, grid],
                gridCount: state.gridCount + 1
            };
        case "deleteGrid":
            return {
                ...state,
                grids: state.grids.filter((grid) => grid.name !== action.payload.name)
            };
        case "applyPatternOptions":
            return applyPatternOptionsReducer(state, action);
        case "applyGridOptions":
            return applyGridOptionsReducer(state, action);
        case "resetPattern":
            return {
                name: state.name,
                options: DefaultPatternOptions,
                grids: [],
                gridCount: 0
            };
        default:
            return state;
    }
};

const applyPatternOptionsReducer = (
    state: PatternState,
    action: ApplyPatternOptionsAction
): PatternState => {
    return {
        ...state,
        grids: state.grids.map((grid) => applyGridOptions(grid, grid.options, action.payload.options)),
        options: action.payload.options
    };
};

const applyGridOptionsReducer = (
    state: PatternState,
    action: ApplyGridOptionsAction
): PatternState => {
    return {
        ...state,
        grids: state.grids.map((grid) => grid.name === action.payload.name
            ? applyGridOptions(grid, action.payload.options, state.options)
            : grid
        )
    };
};

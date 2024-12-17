import { DEFAULT_GRID_OPTIONS, createGrid } from "@repo/bead-grid";
import { PatternActions } from "../actions";
import { PatternState } from "../types";
import { applyPatternOptions, changePatternColor } from "../utils";

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
        case "PATTERN_ADD_GRID":
            return {
                ...state,
                lastModified: new Date(),
                grids: [
                    ...state.grids,
                    createGrid(state.gridCount, {
                        ...DEFAULT_GRID_OPTIONS,
                        type: state.options.layout.type,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any),
                ],
                gridCount: state.gridCount + 1,
            };
        case "PATTERN_DELETE_GRID":
            return {
                ...state,
                lastModified: new Date(),
                grids: state.grids.filter(
                    (grid) => grid.name !== action.payload.name
                ),
            };
        default:
            return state;
    }
};

import { BeadingGridCellState, BeadingGridProperties } from "../types";
import {
    GridAddColumnAfterAction,
    GridAddColumnBeforeAction,
    GridAddRowAfterAction,
    GridAddRowBeforeAction,
    GridApplyOptionsAction,
    GridClearCellsAction,
    GridClearColumnAction,
    GridClearRowAction,
    GridDeleteColumnAction,
    GridDeleteRowAction,
    GridSetCellAction,
    GridSetSelectedCellsAction,
} from "../actions";

export const setBeadingGridCellAction = (
    cell: BeadingGridCellState
): GridSetCellAction => ({
    type: "BEADING_GRID_SET_CELL",
    payload: { cell },
});

export const applyBeadingGridOptionsAction = (
    options: BeadingGridProperties
): GridApplyOptionsAction => ({
    type: "BEADING_GRID_APPLY_OPTIONS",
    payload: { options },
});

export const clearBeadingGridCellsAction = (
    cells: Array<BeadingGridCellState>
): GridClearCellsAction => ({
    type: "BEADING_GRID_CLEAR_CELLS",
    payload: { cells },
});

export const addBeadingGridColumnBeforeAction = (
    column: number
): GridAddColumnBeforeAction => ({
    type: "BEADING_GRID_ADD_COLUMN_BEFORE",
    payload: { column },
});

export const addBeadingGridColumnAfterAction = (
    column: number
): GridAddColumnAfterAction => ({
    type: "BEADING_GRID_ADD_COLUMN_AFTER",
    payload: { column },
});

export const deleteBeadingGridColumnAction = (
    column: number
): GridDeleteColumnAction => ({
    type: "BEADING_GRID_DELETE_COLUMN",
    payload: { column },
});

export const clearBeadingGridColumnAction = (
    column: number
): GridClearColumnAction => ({
    type: "BEADING_GRID_CLEAR_COLUMN",
    payload: { column },
});

export const addBeadingGridRowBeforeAction = (
    row: number
): GridAddRowBeforeAction => ({
    type: "BEADING_GRID_ADD_ROW_BEFORE",
    payload: { row },
});

export const addBeadingGridRowAfterAction = (
    row: number
): GridAddRowAfterAction => ({
    type: "BEADING_GRID_ADD_ROW_AFTER",
    payload: { row },
});

export const deleteBeadingGridRowAction = (
    row: number
): GridDeleteRowAction => ({
    type: "BEADING_GRID_DELETE_ROW",
    payload: { row },
});

export const clearBeadingGridRowAction = (row: number): GridClearRowAction => ({
    type: "BEADING_GRID_CLEAR_ROW",
    payload: { row },
});

export const setSelectedCellsAction = (
    cells: Array<BeadingGridCellState>
): GridSetSelectedCellsAction => ({
    type: "BEADING_GRID_SET_SELECTED_CELLS",
    payload: { cells },
});

// export const mirrorBeadingGridSectionAction = (
//     target: BeadingGridBounds,
//     source: BeadingGridBounds,
//     direction: "vertical" | "horizontal"
// ): GridMirrorSectionAction => ({
//     type: "BEADING_GRID_MIRROR_SECTION",
//     payload: { target, source, direction },
// });

// export const duplicateBeadingGridSectionAction = (
//     target: BeadingGridBounds,
//     source: BeadingGridBounds
// ): GridDuplicateSectionAction => ({
//     type: "BEADING_GRID_DUPLICATE_SECTION",
//     payload: { target, source },
// });

// export const clearBeadingGridSectionAction = (
//     section: BeadingGridBounds
// ): GridClearSectionAction => ({
//     type: "BEADING_GRID_CLEAR_SECTION",
//     payload: { section },
// });

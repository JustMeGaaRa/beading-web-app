import {
    BeadingGridCell,
    BeadingGridProperties,
    BeadingGridWindow,
} from "../types";
import {
    GridAddColumnAfterAction,
    GridAddColumnBeforeAction,
    GridAddRowAfterAction,
    GridAddRowBeforeAction,
    GridApplyOptionsAction,
    GridClearCellsAction,
    GridClearColumnAction,
    GridClearRowAction,
    GridClearSectionAction,
    GridDeleteColumnAction,
    GridDeleteRowAction,
    GridDuplicateSectionAction,
    GridMirrorSectionAction,
    GridSetCellAction,
} from "../actions";

export const setBeadingGridCellAction = (
    name: string,
    cell: BeadingGridCell
): GridSetCellAction => ({
    type: "BEADING_GRID_SET_CELL",
    payload: { name, cell },
});

export const applyBeadingGridOptionsAction = (
    name: string,
    options: BeadingGridProperties
): GridApplyOptionsAction => ({
    type: "BEADING_GRID_APPLY_OPTIONS",
    payload: { name, options },
});

export const clearBeadingGridCellsAction = (
    name: string,
    cells: Array<BeadingGridCell>
): GridClearCellsAction => ({
    type: "BEADING_GRID_CLEAR_CELLS",
    payload: { name, cells },
});

export const addBeadingGridColumnBeforeAction = (
    name: string,
    column: number
): GridAddColumnBeforeAction => ({
    type: "BEADING_GRID_ADD_COLUMN_BEFORE",
    payload: { name, column },
});

export const addBeadingGridColumnAfterAction = (
    name: string,
    column: number
): GridAddColumnAfterAction => ({
    type: "BEADING_GRID_ADD_COLUMN_AFTER",
    payload: { name, column },
});

export const deleteBeadingGridColumnAction = (
    name: string,
    column: number
): GridDeleteColumnAction => ({
    type: "BEADING_GRID_DELETE_COLUMN",
    payload: { name, column },
});

export const clearBeadingGridColumnAction = (
    name: string,
    column: number
): GridClearColumnAction => ({
    type: "BEADING_GRID_CLEAR_COLUMN",
    payload: { name, column },
});

export const addBeadingGridRowBeforeAction = (
    name: string,
    row: number
): GridAddRowBeforeAction => ({
    type: "BEADING_GRID_ADD_ROW_BEFORE",
    payload: { name, row },
});

export const addBeadingGridRowAfterAction = (
    name: string,
    row: number
): GridAddRowAfterAction => ({
    type: "BEADING_GRID_ADD_ROW_AFTER",
    payload: { name, row },
});

export const deleteBeadingGridRowAction = (
    name: string,
    row: number
): GridDeleteRowAction => ({
    type: "BEADING_GRID_DELETE_ROW",
    payload: { name, row },
});

export const clearBeadingGridRowAction = (
    name: string,
    row: number
): GridClearRowAction => ({
    type: "BEADING_GRID_CLEAR_ROW",
    payload: { name, row },
});

export const mirrorBeadingGridSectionAction = (
    name: string,
    target: BeadingGridWindow,
    source: BeadingGridWindow,
    direction: "vertical" | "horizontal"
): GridMirrorSectionAction => ({
    type: "BEADING_GRID_MIRROR_SECTION",
    payload: { name, target, source, direction },
});

export const duplicateBeadingGridSectionAction = (
    name: string,
    target: BeadingGridWindow,
    source: BeadingGridWindow
): GridDuplicateSectionAction => ({
    type: "BEADING_GRID_DUPLICATE_SECTION",
    payload: { name, target, source },
});

export const clearBeadingGridSectionAction = (
    name: string,
    section: BeadingGridWindow
): GridClearSectionAction => ({
    type: "BEADING_GRID_CLEAR_SECTION",
    payload: { name, section },
});

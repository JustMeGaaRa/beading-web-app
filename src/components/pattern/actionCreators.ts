import {
    BeadingGridCell,
    BeadingGridProperties,
    BeadingGridWindow
} from "../beading-grid";
import {
    GridAddColumnAfterAction,
    GridAddColumnBeforeAction,
    GridAddNewAction,
    GridAddRowAfterAction,
    GridAddRowBeforeAction,
    GridApplyOptionsAction,
    GridClearCellsAction,
    GridClearColumnAction,
    GridClearRowAction,
    GridClearSectionAction,
    GridDeleteAction,
    GridDeleteColumnAction,
    GridDeleteRowAction,
    GridDuplicateSectionAction,
    GridMirrorSectionAction,
    GridSetCellAction,
    PatternApplyOptionsAction,
    PatternChangeColorAction,
    PatternResetAction,
    PatternSetNameAction
} from "./actions";
import { PatternOptions, PatternState } from "./types";

export const setPattern = (
    pattern: PatternState
): PatternResetAction => ({
    type: "PATTERN_RESET",
    payload: { pattern }
});

export const changePatternName = (
    name: string
): PatternSetNameAction => ({
    type: "PATTERN_CHANGE_NAME",
    payload: { name }
});

export const changePatternColor = (
    oldColor: string,
    newColor: string
): PatternChangeColorAction => ({
    type: "PATTERN_CHANGE_COLOR",
    payload: { oldColor, newColor }
});

export const applyPatternOptions = (
    options: PatternOptions
): PatternApplyOptionsAction => ({
    type: "PATTERN_APPLY_OPTIONS",
    payload: { options }
});

export const addBeadingGrid = (): GridAddNewAction => ({
    type: "BEADING_GRID_ADD",
    payload: {}
});

export const deleteBeadingGrid = (
    name: string
): GridDeleteAction => ({
    type: "BEADING_GRID_DELETE",
    payload: { name }
});

export const setBeadingGridCell = (
    name: string,
    cell: BeadingGridCell
): GridSetCellAction => ({
    type: "BEADING_GRID_SET_CELL",
    payload: { name, cell }
});

export const applyBeadingGridOptions = (
    name: string,
    options: BeadingGridProperties
): GridApplyOptionsAction => ({
    type: "BEADING_GRID_APPLY_OPTIONS",
    payload: { name, options }
});

export const clearBeadingGridCells = (
    name: string,
    cells: Array<BeadingGridCell>
): GridClearCellsAction => ({
    type: "BEADING_GRID_CLEAR_CELLS",
    payload: { name, cells }
});

export const addBeadingGridColumnBefore = (
    name: string,
    column: number
): GridAddColumnBeforeAction => ({
    type: "BEADING_GRID_ADD_COLUMN_BEFORE",
    payload: { name, column }
});

export const addBeadingGridColumnAfter = (
    name: string,
    column: number
): GridAddColumnAfterAction => ({
    type: "BEADING_GRID_ADD_COLUMN_AFTER",
    payload: { name, column }
});

export const deleteBeadingGridColumn = (
    name: string,
    column: number
): GridDeleteColumnAction => ({
    type: "BEADING_GRID_DELETE_COLUMN",
    payload: { name, column }
});

export const clearBeadingGridColumn = (
    name: string,
    column: number
): GridClearColumnAction => ({
    type: "BEADING_GRID_CLEAR_COLUMN",
    payload: { name, column }
});

export const addBeadingGridRowBefore = (
    name: string,
    row: number
): GridAddRowBeforeAction => ({
    type: "BEADING_GRID_ADD_ROW_BEFORE",
    payload: { name, row }
});

export const addBeadingGridRowAfter = (
    name: string,
    row: number
): GridAddRowAfterAction => ({
    type: "BEADING_GRID_ADD_ROW_AFTER",
    payload: { name, row }
});

export const deleteBeadingGridRow = (
    name: string,
    row: number
): GridDeleteRowAction => ({
    type: "BEADING_GRID_DELETE_ROW",
    payload: { name, row }
});

export const clearBeadingGridRow = (
    name: string,
    row: number
): GridClearRowAction => ({
    type: "BEADING_GRID_CLEAR_ROW",
    payload: { name, row }
});

export const mirrorBeadingGridSection = (
    name: string,
    target: BeadingGridWindow,
    source: BeadingGridWindow,
    direction: "vertical" | "horizontal"
): GridMirrorSectionAction => ({
    type: "BEADING_GRID_MIRROR_SECTION",
    payload: { name, target, source, direction }
});

export const duplicateBeadingGridSection = (
    name: string,
    target: BeadingGridWindow,
    source: BeadingGridWindow
): GridDuplicateSectionAction => ({
    type: "BEADING_GRID_DUPLICATE_SECTION",
    payload: { name, target, source }
});

export const clearBeadingGridSection = (
    name: string,
    section: BeadingGridWindow
): GridClearSectionAction => ({
    type: "BEADING_GRID_CLEAR_SECTION",
    payload: { name, section }
});

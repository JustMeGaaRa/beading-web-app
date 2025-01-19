import {
    BeadingGrid,
    BeadingGridDivider,
    BeadingText,
    BeadingPointerEvent,
    useGridStyles,
    useGridSelection,
    BeadingGridState,
    BeadingGridBackgroundPattern,
    getGridHeight,
    hitTestArea,
    createRenderBounds,
    hitTestCursor,
    BeadingGridSection,
    useGridSelectionFrame,
} from "@repo/bead-grid";
import { usePatternStore, patternSelector } from "@repo/bead-pattern-editor";
import { FC, useCallback, useEffect, useState } from "react";
import {
    useColorPalette,
    useTools,
    BeadingGridSectionActionsToolbar,
    BeadingGridSectionControlsToolbar,
} from "../components";
import Tools from "../utils/tools";

export const BeadingGridContainer: FC<{
    grid: BeadingGridState;
    isLayoutHorizontal?: boolean;
}> = ({ grid, isLayoutHorizontal }) => {
    const { dispatch } = usePatternStore(patternSelector);
    const { styles } = useGridStyles();
    const { selectedColor, setSelectedColor } = useColorPalette();
    const { tool, setTool } = useTools();
    const {
        cliboardCells,
        selectedCells,
        setClipboardCells,
        setSelectedCells,
    } = useGridSelection();
    const { mouseCurrentPosition, mouseDownPosition } = useGridSelectionFrame();
    const [hitInBounds, setHitInBounds] = useState(false);

    useEffect(() => {
        if (!mouseCurrentPosition || !mouseDownPosition) return;
        // TODO: check cell positions instead of mouse positions
        // stylus gives different values onpointerdown and onpointerup
        const isSelectedCell =
            mouseDownPosition &&
            mouseDownPosition?.x === mouseCurrentPosition?.x &&
            mouseDownPosition?.y === mouseCurrentPosition?.y;

        // calculate selected cells based on selected area
        const hitTest = isSelectedCell
            ? hitTestCursor(grid, styles, mouseCurrentPosition)
            : hitTestArea(
                  grid,
                  styles,
                  createRenderBounds(mouseDownPosition!, mouseCurrentPosition!)
              );
        setHitInBounds(hitTest.successfull);

        if (Tools.isCursor(tool)) {
            setSelectedCells(hitTest.successfull ? hitTest.hits : []);
        }

        if (isSelectedCell && Tools.isPencil(tool)) {
            setSelectedCells([]);
            dispatch({
                type: "BEADING_GRID_SET_CELL",
                gridId: grid.gridId,
                cell: { ...hitTest.hits[0], color: selectedColor },
            });
        }
        if (isSelectedCell && Tools.isEraser(tool)) {
            setSelectedCells([]);
            dispatch({
                type: "BEADING_GRID_SET_CELL",
                gridId: grid.gridId,
                cell: { ...hitTest.hits[0], color: "" },
            });
        }
        if (isSelectedCell && Tools.isColorPicker(tool)) {
            setSelectedCells([]);
            setSelectedColor(hitTest.hits[0].color);
            setTool({
                name: "pencil",
                state: { currentAction: "default" },
            });
        }
    }, [
        dispatch,
        grid,
        mouseCurrentPosition,
        mouseDownPosition,
        selectedColor,
        setSelectedCells,
        setSelectedColor,
        setTool,
        styles,
        tool,
    ]);

    // SECTION: grid event handlers
    const handleOnGridCellPointerEnter = useCallback(
        (_: BeadingGridState, event: BeadingPointerEvent) => {
            if (event.isPointerDown && Tools.isPencil(tool)) {
                dispatch({
                    type: "BEADING_GRID_SET_CELL",
                    gridId: grid.gridId,
                    cell: { ...event.cell, color: selectedColor },
                });
            }
            if (event.isPointerDown && Tools.isEraser(tool)) {
                dispatch({
                    type: "BEADING_GRID_SET_CELL",
                    gridId: grid.gridId,
                    cell: { ...event.cell, color: "" },
                });
            }
        },
        [tool, dispatch, grid.gridId, selectedColor]
    );

    // SECTION: toolbar action handlers
    const handleOnSectionCopyClick = useCallback(() => {
        if (Tools.isCursor(tool) && selectedCells.length > 0) {
            setClipboardCells(selectedCells);
        }
    }, [tool, selectedCells, setClipboardCells]);

    const handleOnSectionPasteClick = useCallback(() => {
        if (
            Tools.isCursor(tool) &&
            cliboardCells.length > 0 &&
            mouseCurrentPosition
        ) {
            const hitResult = hitTestCursor(grid, styles, mouseCurrentPosition);

            if (hitResult.hits.length > 0) {
                setSelectedCells([]);
                dispatch({
                    type: "BEADING_GRID_PASTE_SECTION",
                    gridId: grid.gridId,
                    cells: cliboardCells,
                    offset: hitResult.hits[0].offset,
                });
            }
        }
    }, [
        tool,
        cliboardCells,
        mouseCurrentPosition,
        grid,
        styles,
        setSelectedCells,
        dispatch,
    ]);

    const handleOnSectionFlipHorizontalClick = useCallback(() => {
        if (Tools.isCursor(tool) && selectedCells.length > 0) {
            setSelectedCells([]);
            dispatch({
                type: "BEADING_GRID_FLIP_SECTION",
                gridId: grid.gridId,
                cells: selectedCells,
                axis: "horizontal",
            });
        }
    }, [tool, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const handleOnSectionFlipVerticalClick = useCallback(() => {
        if (Tools.isCursor(tool) && selectedCells.length > 0) {
            setSelectedCells([]);
            dispatch({
                type: "BEADING_GRID_FLIP_SECTION",
                gridId: grid.gridId,
                cells: selectedCells,
                axis: "vertical",
            });
        }
    }, [tool, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const handleOnSectionClearClick = useCallback(() => {
        if (Tools.isCursor(tool) && selectedCells.length > 0) {
            setSelectedCells([]);
            dispatch({
                type: "BEADING_GRID_CLEAR_CELLS",
                gridId: grid.gridId,
                cells: selectedCells,
            });
        }
    }, [tool, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const decorationOffset = isLayoutHorizontal
        ? {
              columnIndex: 0,
              rowIndex: -3,
          }
        : {
              columnIndex: -6,
              rowIndex: 0,
          };

    return (
        <BeadingGrid
            gridId={grid.gridId}
            offset={grid.offset}
            cells={grid.cells}
            options={grid.options}
            onCellEnter={handleOnGridCellPointerEnter}
        >
            <BeadingGridBackgroundPattern />
            <BeadingText
                text={grid.name}
                offset={decorationOffset}
                options={grid.options}
            />
            <BeadingGridDivider
                length={
                    isLayoutHorizontal
                        ? getGridHeight(grid.options) + 6
                        : grid.options.width + 6
                }
                offset={decorationOffset}
                orientation={isLayoutHorizontal ? "vertical" : "horizontal"}
            />
            <BeadingGridSection
                cells={selectedCells}
                // onHover={handleOnGridSectionHover}
            >
                <BeadingGridSectionControlsToolbar
                    isVisible={Tools.isCursor(tool) && hitInBounds}
                />

                {/* TODO: consider moving this toolbar inside grid and handling state internally */}
                <BeadingGridSectionActionsToolbar
                    isVisible={Tools.isCursor(tool)}
                    tool={tool}
                    onCopy={handleOnSectionCopyClick}
                    onPaste={handleOnSectionPasteClick}
                    onFlipHorizontal={handleOnSectionFlipHorizontalClick}
                    onFlipVertical={handleOnSectionFlipVerticalClick}
                    onClear={handleOnSectionClearClick}
                />
            </BeadingGridSection>
        </BeadingGrid>
    );
};

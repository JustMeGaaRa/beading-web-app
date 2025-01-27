import {
    BeadeeGrid,
    BeadeeGridBackgroundPattern,
    BeadeeGridDivider,
    BeadeeGridSection,
    BeadeeText,
    BeadingGrid,
    useBeadeeGridStyles,
    useBeadeeGridSelection,
    getGridHeight,
    getCellAtPosition,
    RenderPoint,
    BeadeeGridOptionsProvider,
    BeadingGridMetadata,
    BeadeeGridMetadataProvider,
} from "@repo/bead-grid";
import { usePatternStore, patternSelector } from "@repo/bead-pattern-editor";
import { FC, useCallback } from "react";
import {
    useTools,
    BeadingGridSectionActionsToolbar,
    BeadingGridSectionControlsToolbar,
    createToolInfo,
} from "../components";

export const BeadingGridContainer: FC<{
    grid: BeadingGrid;
    metadata?: BeadingGridMetadata;
    isLayoutHorizontal?: boolean;
    mouseCurrentPosition: RenderPoint | undefined;
    mouseDownPosition: RenderPoint | undefined;
    isMouseDown?: boolean;
}> = ({
    grid,
    metadata,
    isLayoutHorizontal,
    mouseCurrentPosition,
    isMouseDown,
}) => {
    const { tool } = useTools();
    const { dispatch } = usePatternStore(patternSelector);
    const { styles } = useBeadeeGridStyles();
    const {
        cliboardCells,
        selectedCells,
        setClipboardCells,
        setSelectedCells,
    } = useBeadeeGridSelection();

    const toolInfo = createToolInfo(tool);

    // SECTION: toolbar action handlers
    const onCopyClick = useCallback(() => {
        if (toolInfo.isCursorEnabled && selectedCells[grid.gridId].length > 0) {
            setClipboardCells(selectedCells);
        }
    }, [toolInfo, selectedCells, grid.gridId, setClipboardCells]);

    const onPasteClick = useCallback(() => {
        if (
            toolInfo.isCursorEnabled &&
            cliboardCells[grid.gridId].length > 0 &&
            mouseCurrentPosition
        ) {
            const hitResult = getCellAtPosition(
                grid,
                styles,
                mouseCurrentPosition
            );

            if (hitResult.hits.length > 0) {
                setSelectedCells({});
                dispatch({
                    type: "BEADING_GRID_PASTE_SECTION",
                    gridId: grid.gridId,
                    cells: cliboardCells[grid.gridId],
                    offset: hitResult.hits[0].offset,
                });
            }
        }
    }, [
        toolInfo,
        cliboardCells,
        mouseCurrentPosition,
        grid,
        styles,
        setSelectedCells,
        dispatch,
    ]);

    const onFlipHorizontalClick = useCallback(() => {
        if (toolInfo.isCursorEnabled && selectedCells[grid.gridId].length > 0) {
            setSelectedCells({});
            dispatch({
                type: "BEADING_GRID_FLIP_SECTION",
                gridId: grid.gridId,
                cells: selectedCells[grid.gridId],
                axis: "horizontal",
            });
        }
    }, [toolInfo, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const onFlipVerticalClick = useCallback(() => {
        if (toolInfo.isCursorEnabled && selectedCells[grid.gridId].length > 0) {
            setSelectedCells({});
            dispatch({
                type: "BEADING_GRID_FLIP_SECTION",
                gridId: grid.gridId,
                cells: selectedCells[grid.gridId],
                axis: "vertical",
            });
        }
    }, [toolInfo, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const onClearClick = useCallback(() => {
        if (toolInfo.isCursorEnabled && selectedCells[grid.gridId].length > 0) {
            setSelectedCells({});
            dispatch({
                type: "BEADING_GRID_CLEAR_CELLS",
                gridId: grid.gridId,
                cells: selectedCells[grid.gridId],
            });
        }
    }, [toolInfo, selectedCells, setSelectedCells, dispatch, grid.gridId]);

    const decorationOffset = isLayoutHorizontal
        ? {
              columnIndex: 0,
              rowIndex: -3,
          }
        : {
              columnIndex: -6,
              rowIndex: 0,
          };
    // TODO: hide toolbar when selecting an area or dragging the section
    // NOTE: visible only when cursor tool enabled and some cells are selected
    const toolbarsVisible =
        toolInfo.isCursorEnabled &&
        !isMouseDown &&
        selectedCells[grid.gridId]?.length > 0;

    return (
        <BeadeeGridOptionsProvider options={grid.options}>
            <BeadeeGridMetadataProvider metadata={metadata}>
                <BeadeeGrid
                    gridId={grid.gridId}
                    name={grid.name}
                    offset={grid.offset}
                    cells={grid.cells}
                    options={grid.options}
                >
                    <BeadeeGridBackgroundPattern />
                    <BeadeeText
                        text={grid.name}
                        offset={decorationOffset}
                        options={grid.options}
                    />
                    <BeadeeGridDivider
                        length={
                            isLayoutHorizontal
                                ? getGridHeight(grid.options) + 6
                                : grid.options.width + 6
                        }
                        offset={decorationOffset}
                        orientation={
                            isLayoutHorizontal ? "vertical" : "horizontal"
                        }
                    />
                </BeadeeGrid>
                <BeadeeGridSection
                    cells={selectedCells[grid.gridId] ?? []}
                    offset={grid.offset}
                    options={grid.options}
                >
                    <BeadingGridSectionControlsToolbar
                        isVisible={toolbarsVisible}
                    />
                    <BeadingGridSectionActionsToolbar
                        isVisible={toolbarsVisible}
                        tool={tool}
                        onCopy={onCopyClick}
                        onPaste={onPasteClick}
                        onFlipHorizontal={onFlipHorizontalClick}
                        onFlipVertical={onFlipVerticalClick}
                        onClear={onClearClick}
                    />
                </BeadeeGridSection>
            </BeadeeGridMetadataProvider>
        </BeadeeGridOptionsProvider>
    );
};

import {
    BeadeeGrid,
    BeadeeGridBackgroundPattern,
    BeadeeGridDivider,
    BeadeeGridSection,
    BeadeeGridName,
    BeadingGrid,
    useBeadeeGridSelection,
    RenderPoint,
    BeadeeGridOptionsProvider,
    BeadingGridMetadata,
    BeadeeGridMetadataProvider,
    distanceBetween,
    getStageRelativePosition,
    isZeroOffset,
    BeadeeRenderBoundsProvider,
    shiftBounds,
    extendBounds,
} from "@beadee/grid-editor";
import {
    usePatternStore,
    patternSelector,
    useBeadeeSectionDragContext,
    useBeadeePatternHitTest,
} from "@beadee/pattern-editor";
import { FC, useCallback, useRef } from "react";
import {
    useTools,
    BeadeeGridSectionActionsToolbar,
    BeadeeGridSectionControlsToolbar,
    createToolInfo,
} from "../components";
import Konva from "konva";

export const BeadeeGridContainer: FC<{
    grid: BeadingGrid;
    metadata?: BeadingGridMetadata;
    patternRef: React.RefObject<Konva.Stage>;
    layout?: "horizontal" | "vertical";
    isPointerDown?: boolean;
    pointerPosition: RenderPoint | undefined;
}> = ({
    grid,
    metadata,
    patternRef,
    layout = "vertical",
    isPointerDown,
    pointerPosition,
}) => {
    const { tool } = useTools();
    const { dispatch } = usePatternStore(patternSelector);
    const {
        cliboardCells,
        selectedCells,
        setClipboardCells,
        setSelectedCells,
    } = useBeadeeGridSelection();
    const { getCellAtPosition } = useBeadeePatternHitTest();

    const toolInfo = createToolInfo(tool);

    const dragLastPosition = useRef<RenderPoint>();
    const { startDragging, endDragging, updateDragging } =
        useBeadeeSectionDragContext(grid);

    const handleOnDragStart = useCallback(() => {
        const currentPosition = getStageRelativePosition(patternRef.current);
        dragLastPosition.current = currentPosition;
        startDragging();
    }, [patternRef, startDragging]);

    const handleOnDrag = useCallback(() => {
        if (dragLastPosition.current) {
            const currentPosition = getStageRelativePosition(
                patternRef.current
            );
            const lastCell = getCellAtPosition(dragLastPosition.current);
            const currentCell = getCellAtPosition(currentPosition);
            const lastCellOffset = lastCell[grid.gridId][0].offset;
            const currentOffset = currentCell[grid.gridId][0].offset;
            const distance = distanceBetween(lastCellOffset, currentOffset);

            if (!isZeroOffset(distance)) {
                dragLastPosition.current = currentPosition;
                updateDragging(distance);
            }
        }
    }, [patternRef, getCellAtPosition, grid.gridId, updateDragging]);

    const handleOnDragEnd = useCallback(
        (event: { cancelled: boolean }) => {
            dragLastPosition.current = undefined;
            endDragging(event.cancelled);
        },
        [endDragging]
    );

    // SECTION: toolbar action handlers
    const onCopyClick = useCallback(() => {
        if (toolInfo.isCursorEnabled && selectedCells[grid.gridId].length > 0) {
            setClipboardCells(selectedCells);
        }
    }, [toolInfo, selectedCells, grid.gridId, setClipboardCells]);

    const onPasteClick = useCallback(() => {
        if (
            toolInfo.isCursorEnabled &&
            cliboardCells[grid.gridId]?.length > 0 &&
            pointerPosition
        ) {
            const hitResult = getCellAtPosition(pointerPosition);

            if (hitResult[grid.gridId]?.length > 0) {
                const targetCells = cliboardCells[grid.gridId];
                const targetCellOffset = hitResult[grid.gridId][0].offset;

                setSelectedCells({});
                dispatch({
                    type: "BEADING_GRID_PASTE_SECTION",
                    gridId: grid.gridId,
                    cells: targetCells,
                    offset: targetCellOffset,
                });
            }
        }
    }, [
        toolInfo.isCursorEnabled,
        cliboardCells,
        grid.gridId,
        pointerPosition,
        getCellAtPosition,
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

    // NOTE: visible only when cursor tool enabled and some cells are selected
    const toolbarsVisible =
        toolInfo.isCursorEnabled &&
        !isPointerDown &&
        selectedCells[grid.gridId]?.length > 0;

    const gridLabelBounds = shiftBounds(
        extendBounds(
            metadata?.gridBounds ?? {
                position: { x: 0, y: 0 },
                height: 0,
                width: 0,
            },
            layout === "vertical" ? { x: 200, y: 0 } : { x: 0, y: 100 }
        ),
        layout === "vertical" ? { x: -200, y: 0 } : { x: 0, y: -100 }
    );

    return (
        <BeadeeGridOptionsProvider offset={grid.offset} options={grid.options}>
            <BeadeeGridMetadataProvider metadata={metadata}>
                <BeadeeGrid
                    id={grid.gridId}
                    name={grid.name}
                    cells={grid.cells}
                    offset={grid.offset}
                    options={grid.options}
                >
                    <BeadeeGridBackgroundPattern id={grid.gridId} />
                    <BeadeeRenderBoundsProvider {...gridLabelBounds}>
                        <BeadeeGridName
                            alignment={"start"}
                            placement={"start"}
                            text={grid.name}
                        />
                        <BeadeeGridDivider
                            placement={"start"}
                            orientation={
                                layout === "horizontal"
                                    ? "vertical"
                                    : "horizontal"
                            }
                        />
                    </BeadeeRenderBoundsProvider>
                </BeadeeGrid>
                <BeadeeGridSection
                    cells={selectedCells[grid.gridId] ?? []}
                    offset={grid.offset}
                    options={grid.options}
                >
                    <BeadeeGridSectionControlsToolbar
                        isVisible={toolbarsVisible}
                        onDragStart={handleOnDragStart}
                        onDrag={handleOnDrag}
                        onDragEnd={handleOnDragEnd}
                    />
                    <BeadeeGridSectionActionsToolbar
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

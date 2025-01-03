import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useDisclosure,
} from "@chakra-ui/react";
import {
    BeadingGrid,
    BeadingGridStylesProvider,
    BeadingGridProvider,
    BeadingGridDivider,
    BeadingText,
    BeadingPointerEvent,
    useGridStyles,
    DefaultGridStyles,
    TextState,
    useGridSelection,
    BeadingFrame,
    BeadingGridState,
    BeadingGridBackgroundPattern,
    getGridHeight,
    DefaultGridProperties,
    addBeadingGridColumnAfterAction,
    addBeadingGridRowBeforeAction,
    addBeadingGridRowAfterAction,
    clearBeadingGridRowAction,
    deleteBeadingGridRowAction,
    addBeadingGridColumnBeforeAction,
    clearBeadingGridColumnAction,
    deleteBeadingGridColumnAction,
    setBeadingGridCellAction,
    BeadingGridSelectedArea,
    hitTestArea,
    createRenderBounds,
    getGridCellRenderBounds,
} from "@repo/bead-grid";
import {
    usePatternStore,
    PatternState,
    usePatterHistory,
    getPatternRenderSize,
    patternSelector,
    dirtyStateSelector,
    getPatternSize,
} from "@repo/bead-pattern-editor";
import {
    ArrowDownIcon,
    DocumentCodeIcon,
    DocumentImageIcon,
} from "@repo/icons";
// import throttle from "just-throttle";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    useColorPalette,
    useTools,
    Shortcuts,
    PatternActionToolbar,
} from "../components";
import {
    calculateNewPosition,
    downloadUri,
    getContentOffset,
    getContentScale,
    getPointerOffset,
    toJsonUri,
    SCALE_MAXIMUM,
} from "../utils";
import { putPattern } from "../api";

const hotkeysOptions = { preventDefault: true };

type Position = { x: number; y: number } | undefined;

export const PatternContainer: FC = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const lastTouchDistanceRef = useRef(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gridRefs = useRef<Record<string, any>>({});

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | null>(null);
    const [rowState, setRowState] = useState<TextState | null>();
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { selectedColor } = useColorPalette();
    const { tool } = useTools();
    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);
    const {
        selectedCells,
        selectedColumn,
        selectedRow,
        setSelectedCells,
        setSelectedColumn,
        setSelectedRow,
    } = useGridSelection();
    const { undo, redo } = usePatterHistory();

    const { styles } = useGridStyles();
    const { height, width } = getPatternSize(pattern.grids, pattern.options);

    const isLayoutHorizontal =
        pattern.options.layout.orientation === "horizontal";
    const isMoveEnabled = tool.name === "move";
    const isCursorEnabled =
        tool.name === "cursor" && tool.state.currentAction === "default";
    const isPencilEnabled = tool.name === "pencil";
    const isEraserEnabled = tool.name === "eraser";

    const centerStage = useCallback(
        (pattern: PatternState) => {
            if (stageRef.current && pattern?.grids.length > 0) {
                const patternSize = getPatternRenderSize(
                    pattern.grids,
                    styles,
                    pattern.options
                );
                const position = {
                    x: window.innerWidth / 2 - patternSize.width / 2,
                    y: window.innerHeight / 2 - patternSize.height / 2,
                };
                stageRef.current.position(position);
                stageRef.current.scale({ x: 1, y: 1 });
            }
        },
        [styles]
    );

    const resetGridsSelection = useCallback((source?: unknown) => {
        Object.entries(gridRefs.current).forEach(([name, ref]) => {
            if (
                typeof source === "object" &&
                source &&
                "name" in source &&
                name !== source?.name
            ) {
                ref.onResetSelection();
            }
        });
    }, []);

    useHotkeys(
        Shortcuts.patternCenter.keyString,
        () => centerStage(pattern),
        hotkeysOptions,
        [centerStage, pattern]
    );
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), hotkeysOptions, [
        undo,
    ]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), hotkeysOptions, [
        redo,
    ]);

    useEffect(() => {
        centerStage(pattern);
    }, [centerStage]);

    useEffect(() => {
        // NOTE: auto save pattern cover every 5 seconds
        const intervalId = setInterval(() => {
            if (isDirty) {
                const imageUri = stageRef.current?.toDataURL() ?? "";
                putPattern({ ...pattern, coverUrl: imageUri });
                resetDirty();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [pattern, isDirty, resetDirty]);

    // SECTION: stage event handlers
    const handleOnStageWheel = useCallback(
        (event: Konva.KonvaEventObject<WheelEvent>) => {
            event.evt.preventDefault();

            const stage = event.target.getStage();
            if (!stage) return;

            const currentScale = stage.scaleX();
            const pointerPosition = stage.getPointerPosition();
            const stagePosition = stage.position();

            if (!pointerPosition) return;

            const stageSize = stage.getSize();
            const patternSize = getPatternRenderSize(
                pattern.grids,
                styles,
                pattern.options
            );
            const minScale = getContentScale(stageSize, patternSize);
            const maxScale = SCALE_MAXIMUM;

            const direction = event.evt.deltaY > 0 ? -1 : 1;
            const scaleBy = 1.2;
            let newScale =
                direction > 0 ? currentScale * scaleBy : currentScale / scaleBy;

            if (direction > 0) {
                // Zoom In: Keep the point under cursor stationary
                newScale = Math.min(maxScale, newScale);

                const mousePointTo = {
                    x: (pointerPosition.x - stagePosition.x) / currentScale,
                    y: (pointerPosition.y - stagePosition.y) / currentScale,
                };

                const newPos = {
                    x: pointerPosition.x - mousePointTo.x * newScale,
                    y: pointerPosition.y - mousePointTo.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);
            } else {
                // Zoom Out: Return view towards center
                newScale = Math.max(minScale, newScale);

                const stageCenter = {
                    x: stageSize.width / 2,
                    y: stageSize.height / 2,
                };
                const patternCenter = {
                    x: patternSize.width / 2,
                    y: patternSize.height / 2,
                };

                const newPos = {
                    x: stageCenter.x - patternCenter.x * newScale,
                    y: stageCenter.y - patternCenter.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);
            }

            stage.batchDraw();
        },
        [pattern.grids, pattern.options, styles]
    );

    const handleOnStageTouchMove = useCallback(
        (event: Konva.KonvaEventObject<TouchEvent>) => {
            event.evt.preventDefault();

            // NOTE: pinch gesture requires two fingers, otherwise it might be other gesture
            if (event.evt.touches.length !== 2) return;

            const [touchPoint1, touchPoint2] = event.evt.touches as unknown as [
                Touch,
                Touch,
            ];
            const currentTouchDistance = Math.hypot(
                touchPoint2.clientX - touchPoint1.clientX,
                touchPoint2.clientY - touchPoint1.clientY
            );

            if (lastTouchDistanceRef.current === 0) {
                lastTouchDistanceRef.current = currentTouchDistance;
                return;
            }

            const isZoomingOut =
                currentTouchDistance < lastTouchDistanceRef.current;

            const stage = event.target.getStage();
            if (!stage) return;

            const pointerPosition = {
                x: (touchPoint1.clientX + touchPoint2.clientX) / 2,
                y: (touchPoint1.clientY + touchPoint2.clientY) / 2,
            };

            const stageSize = stage.getSize();
            const stagePosition = stage.position();
            const patternSize = getPatternRenderSize(
                pattern.grids,
                styles,
                pattern.options
            );
            const patternCenter = getContentOffset(stageSize, patternSize);
            const minScale = getContentScale(stageSize, patternSize);
            const maxScale = SCALE_MAXIMUM;
            const oldScale = stage.scaleX();

            let newScale =
                oldScale *
                (currentTouchDistance / lastTouchDistanceRef.current);

            if (isZoomingOut) {
                // Zooming out: limit to minimum scale and gravitate toward rectangle center
                newScale = Math.max(minScale, newScale);

                // Calculate the interpolation factor
                const interpolationFactor =
                    (newScale - minScale) / (oldScale - minScale);

                if (interpolationFactor > 0) {
                    // Calculate the new position interpolated toward the center of the stage
                    const newPosition = {
                        x:
                            stagePosition.x +
                            (patternCenter.x - stagePosition.x) *
                                (1 - interpolationFactor),
                        y:
                            stagePosition.y +
                            (patternCenter.y - stagePosition.y) *
                                (1 - interpolationFactor),
                    };

                    stage.position(newPosition);
                }
            } else {
                newScale = Math.min(maxScale, newScale);

                const targetPoint = getPointerOffset(
                    pointerPosition,
                    stagePosition,
                    oldScale
                );
                const newPosition = calculateNewPosition(
                    targetPoint,
                    pointerPosition,
                    newScale
                );

                stage.position(newPosition);
            }

            stage.scale({ x: newScale, y: newScale });
            stage.batchDraw();

            lastTouchDistanceRef.current = currentTouchDistance;
        },
        [pattern.grids, pattern.options, styles]
    );

    const handleOnStageTouchEnd = useCallback(() => {
        lastTouchDistanceRef.current = 0;
    }, []);

    const handleOnStageClick = useCallback(() => {
        // NOTE: clear all active selections when clicked on stage empty space
        setSelectedColumn(-1);
        setSelectedRow(-1);
        resetGridsSelection();
    }, [resetGridsSelection, setSelectedColumn, setSelectedRow]);

    const handleOnStageContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            event.evt.preventDefault();
        },
        []
    );

    // SECTION: pattern event handlers
    const handleOnPatternColumnClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            setColumnState(columnState);
        },
        []
    );

    const handleOnPatternRowClick = useCallback(
        (_event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            setRowState(rowState);
        },
        []
    );

    const handleOnPatternContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            event.evt.preventDefault();
            const position = event.target.getStage()?.getPointerPosition() ?? {
                x: 0,
                y: 0,
            };
            setMenuPosition(position);
            onOpen();
        },
        [onOpen]
    );

    const handleOnPatternSavePngClick = useCallback(() => {
        const imageUri = stageRef.current?.toDataURL() ?? "";
        downloadUri(imageUri, `${pattern.name}.png`);
    }, [pattern]);

    const handleOnPatternSaveJsonClick = useCallback(() => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [pattern]);

    // SECTION: context menu handlers
    const handleOnGridAddRowAbove = useCallback(() => {
        if (rowState) {
            dispatch(addBeadingGridRowBeforeAction(rowState.gridIndex));
        }
    }, [dispatch, rowState]);

    const handleOnGridAddRowBelow = useCallback(() => {
        if (rowState) {
            dispatch(addBeadingGridRowAfterAction(rowState.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridClearRow = useCallback(() => {
        if (rowState) {
            dispatch(clearBeadingGridRowAction(rowState.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridDeleteRow = useCallback(() => {
        if (rowState) {
            dispatch(deleteBeadingGridRowAction(rowState.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridAddColumnLeft = useCallback(() => {
        if (columnState) {
            dispatch(addBeadingGridColumnBeforeAction(columnState.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridAddColumnRight = useCallback(() => {
        if (columnState) {
            dispatch(addBeadingGridColumnAfterAction(columnState.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridClearColumn = useCallback(() => {
        if (columnState) {
            dispatch(clearBeadingGridColumnAction(columnState.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridDeleteColumn = useCallback(() => {
        if (columnState) {
            dispatch(deleteBeadingGridColumnAction(columnState.gridIndex));
        }
    }, [columnState, dispatch]);

    // SECTION: grid event handlers
    const handleOnGridCellPointerEnter = useCallback(
        (_: BeadingGridState, event: BeadingPointerEvent) => {
            if (event.isPointerDown && isPencilEnabled) {
                dispatch(
                    setBeadingGridCellAction({
                        ...event.cell,
                        color: selectedColor,
                    })
                );
            }
            if (event.isPointerDown && isEraserEnabled) {
                dispatch(
                    setBeadingGridCellAction({ ...event.cell, color: "" })
                );
            }
        },
        [isPencilEnabled, isEraserEnabled, selectedColor, dispatch]
    );

    const isPointerDown = false;
    const handleOnGridSelectionChange = useCallback(
        (source: unknown) => {
            if (isPointerDown && isCursorEnabled) {
                resetGridsSelection(source);
            }
        },
        [isPointerDown, isCursorEnabled, resetGridsSelection]
    );
    console.log(handleOnGridSelectionChange);

    const [startPosition, setStarPosition] = useState<Position>();
    const [endPosition, setEndPosition] = useState<Position>();
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleOnPointerDown = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (isCursorEnabled) {
                const stage = event.target.getStage();
                const position = stage?.getRelativePointerPosition() ?? {
                    x: 0,
                    y: 0,
                };
                setStarPosition(position);
                setEndPosition(undefined);
            }
            setIsMouseDown(true);
        },
        [isCursorEnabled]
    );

    const handleOnPointerUp = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (isCursorEnabled) {
                const stage = event.target.getStage();
                const position = stage?.getRelativePointerPosition() ?? {
                    x: 0,
                    y: 0,
                };
                setEndPosition(position);

                if (startPosition && endPosition) {
                    const area = createRenderBounds(startPosition, endPosition);
                    const hitTest = hitTestArea(pattern.grids[0], styles, area);
                    setSelectedCells(hitTest.hits);

                    if (hitTest.hits.length > 0) {
                        const position = getGridCellRenderBounds(
                            hitTest.hits[0].offset,
                            pattern.grids[0].options,
                            styles
                        );
                        setToolbarPosition(position);
                    }
                }
            }
            setIsMouseDown(false);
            setStarPosition(undefined);
            setEndPosition(undefined);
        },
        [
            setSelectedCells,
            endPosition,
            isCursorEnabled,
            pattern.grids,
            startPosition,
            styles,
        ]
    );

    const handleOnPointerMove = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (isCursorEnabled && isMouseDown) {
                const stage = event.target.getStage();
                const position = stage?.getRelativePointerPosition() ?? {
                    x: 0,
                    y: 0,
                };
                setEndPosition(position);
            }
        },
        [isCursorEnabled, isMouseDown]
    );

    return (
        <Box
            cursor={
                tool.name === "move"
                    ? "grab"
                    : tool.name === "cursor"
                      ? "crosshair"
                      : "cursor"
            }
            height={"100%"}
            width={"100%"}
        >
            <Stage
                ref={stageRef}
                draggable={isMoveEnabled}
                height={window.innerHeight}
                width={window.innerWidth}
                onClick={handleOnStageClick}
                onContextMenu={handleOnStageContextMenu}
                onTouchMove={handleOnStageTouchMove}
                onTouchEnd={handleOnStageTouchEnd}
                onPointerDown={handleOnPointerDown}
                onPointerUp={handleOnPointerUp}
                onPointerMove={handleOnPointerMove}
                onWheel={handleOnStageWheel}
            >
                <Layer>
                    <BeadingGridStylesProvider styles={DefaultGridStyles}>
                        {pattern.grids.map((grid) => (
                            <BeadingGridProvider key={grid.name}>
                                <BeadingGrid
                                    cells={grid.cells}
                                    offset={grid.offset}
                                    options={grid.options}
                                    onCellEnter={handleOnGridCellPointerEnter}
                                >
                                    <BeadingGridBackgroundPattern />
                                    <BeadingText
                                        text={grid.name}
                                        offset={
                                            isLayoutHorizontal
                                                ? {
                                                      columnIndex: 1,
                                                      rowIndex: -4,
                                                  }
                                                : {
                                                      columnIndex: -4,
                                                      rowIndex: 0,
                                                  }
                                        }
                                        options={grid.options}
                                    />
                                    <BeadingGridDivider
                                        length={
                                            isLayoutHorizontal
                                                ? getGridHeight(grid.options) +
                                                  4
                                                : grid.options.width + 4
                                        }
                                        offset={
                                            isLayoutHorizontal
                                                ? {
                                                      columnIndex: 0,
                                                      rowIndex: -4,
                                                  }
                                                : {
                                                      columnIndex: -4,
                                                      rowIndex: 0,
                                                  }
                                        }
                                        orientation={
                                            isLayoutHorizontal
                                                ? "vertical"
                                                : "horizontal"
                                        }
                                    />
                                </BeadingGrid>
                            </BeadingGridProvider>
                        ))}

                        {startPosition && endPosition && isCursorEnabled && (
                            <BeadingGridSelectedArea
                                x={startPosition.x}
                                y={startPosition.y}
                                width={endPosition.x - startPosition.x}
                                height={endPosition.y - startPosition.y}
                            />
                        )}

                        {pattern.grids.length > 0 && (
                            <BeadingFrame
                                height={height}
                                width={width}
                                options={
                                    pattern.grids.at(0)?.options ??
                                    DefaultGridProperties
                                }
                                onColumnClick={handleOnPatternColumnClick}
                                onRowClick={handleOnPatternRowClick}
                                onContextMenu={handleOnPatternContextMenu}
                            />
                        )}

                        {isCursorEnabled && selectedCells.length > 0 && (
                            <Html
                                groupProps={toolbarPosition}
                                transform
                                transformFunc={(attr) => ({
                                    ...attr,
                                    scaleX: 1,
                                    scaleY: 1,
                                })}
                            >
                                <PatternActionToolbar
                                    tool={tool}
                                    // onMirror={handleOnMirrorSelectionClick}
                                    // onDuplicate={
                                    //     handleOnDuplicateSelectionClick
                                    // }
                                    // onClear={handleOnClearClick}
                                    // onDone={handleOnDoneClick}
                                />
                            </Html>
                        )}
                    </BeadingGridStylesProvider>
                </Layer>
            </Stage>

            <Menu isOpen={isOpen} closeOnBlur closeOnSelect onClose={onClose}>
                <MenuButton
                    left={menuPosition.x}
                    position={"absolute"}
                    top={menuPosition.y}
                    visibility={"hidden"}
                />
                {selectedRow >= 0 && (
                    <MenuList>
                        <MenuItem onClick={handleOnGridAddRowAbove}>
                            Add row above
                        </MenuItem>
                        <MenuItem onClick={handleOnGridAddRowBelow}>
                            Add row below
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleOnGridClearRow}>
                            Clear row
                        </MenuItem>
                        <MenuItem
                            color={"red.600"}
                            onClick={handleOnGridDeleteRow}
                        >
                            Delete row
                        </MenuItem>
                    </MenuList>
                )}
                {selectedColumn >= 0 && (
                    <MenuList>
                        <MenuItem onClick={handleOnGridAddColumnLeft}>
                            Add column before
                        </MenuItem>
                        <MenuItem onClick={handleOnGridAddColumnRight}>
                            Add column after
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleOnGridClearColumn}>
                            Clear column
                        </MenuItem>
                        <MenuItem
                            color={"red.600"}
                            onClick={handleOnGridDeleteColumn}
                        >
                            Delete column
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>
            {stageRef.current &&
                createPortal(
                    <Menu>
                        <MenuButton
                            as={Button}
                            colorScheme={"gray"}
                            rightIcon={<ArrowDownIcon />}
                            size={"sm"}
                            variant={"solid"}
                            backgroundColor={"gray.900"}
                            color={"white"}
                            _hover={{ backgroundColor: "gray.700" }}
                            _active={{ backgroundColor: "gray.600" }}
                        >
                            Save As
                        </MenuButton>
                        <MenuList zIndex={1000}>
                            <MenuItem
                                icon={<DocumentImageIcon />}
                                onClick={handleOnPatternSavePngClick}
                            >
                                Image (.png)
                            </MenuItem>
                            <MenuItem
                                icon={<DocumentCodeIcon />}
                                onClick={handleOnPatternSaveJsonClick}
                            >
                                Pattern (.json)
                            </MenuItem>
                        </MenuList>
                    </Menu>,
                    document.getElementById(
                        "header-actions-group"
                    ) as HTMLElement
                )}
        </Box>
    );
};

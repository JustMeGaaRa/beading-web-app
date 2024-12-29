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
    getGridActualHeight,
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
    BeadingGridSelectionProvider,
    BeadingGridSelectedArea
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
    MediaImage,
    NavArrowDown,
    Page
} from "iconoir-react";
import {
    FC,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import {
    Layer,
    Rect,
    Stage,
} from "react-konva";
// import { Html } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    useColorPalette,
    useTools,
    Shortcuts,
} from "../components";
import {
    calculateNewPosition,
    downloadUri,
    getContentOffset,
    getContentScale,
    getPointerOffset,
    toJsonUri,
    SCALE_MAXIMUM
} from "../utils";
import { putPattern } from "../api";

const hotkeysOptions = { preventDefault: true };

type Position = { x: number, y: number } | undefined;

export const PatternContainer: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const lastTouchDistanceRef = useRef(0);
    const gridRefs = useRef<Record<string, unknown>>({});

    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | null>(null);
    const [rowState, setRowState] = useState<TextState | null>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { selectedColor } = useColorPalette();
    const { tool } = useTools();
    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);
    const {
        selectedColumn,
        selectedRow,
        setSelectedColumn,
        setSelectedRow
    } = useGridSelection();
    const { undo, redo } = usePatterHistory();

    const { styles } = useGridStyles();
    const { height, width } = getPatternSize(pattern.grids, pattern.options);

    const isLayoutHorizontal = pattern.options.layout.orientation === "horizontal";
    const isMoveEnabled = tool.name === "move";
    const isCursorEnabled = tool.name === "cursor" && tool.state.currentAction === "default";
    const isPencilEnabled = tool.name === "pencil";
    const isEraserEnabled = tool.name === "eraser";

    const centerStage = useCallback((pattern: PatternState) => {
        if (containerRef.current && stageRef.current && pattern?.grids.length > 0) {
            const patternSize = getPatternRenderSize(pattern.grids, styles, pattern.options);
            const position = {
                x: containerRef.current.offsetWidth / 2 - patternSize.width / 2,
                y: containerRef.current.offsetHeight / 2 - patternSize.height / 2,
            };
            stageRef.current.position(position);
            stageRef.current.scale({ x: 1, y: 1 });
        }
    }, [styles]);

    const resetGridsSelection = useCallback((source?: unknown) => {
        Object
            .entries(gridRefs.current)
            .forEach(([name, ref]) => {
                if (typeof source === "object" && source && "name" in source && name !== source?.name) {
                    ref.onResetSelection();
                }
            });
    }, []);

    useHotkeys(Shortcuts.patternCenter.keyString, () => centerStage(pattern), hotkeysOptions, [centerStage, pattern]);
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), hotkeysOptions, [undo]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), hotkeysOptions, [redo]);

    useEffect(() => {
        const resizeStage = () => {
            if (containerRef.current) {
                setStageSize({
                    height: containerRef.current.offsetHeight,
                    width: containerRef.current.offsetWidth,
                });
                centerStage(pattern);
            }
        };

        resizeStage();
        window.addEventListener("resize", resizeStage);

        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, [centerStage, pattern]);

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
    const handleOnStageWheel = useCallback((event: Konva.KonvaEventObject<WheelEvent>) => {
        event.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        const currentScale = stage.scaleX();
        const pointerPosition = stage.getPointerPosition();
        const stagePosition = stage.position();

        if (!pointerPosition) return;

        const patternSize = getPatternRenderSize(pattern.grids, styles, pattern.options);
        const minScale = getContentScale(stageSize, patternSize);
        const maxScale = SCALE_MAXIMUM;

        const direction = event.evt.deltaY > 0 ? -1 : 1;
        const scaleBy = 1.2;
        let newScale = direction > 0
            ? currentScale * scaleBy
            : currentScale / scaleBy;

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
        }
        else {
            // Zoom Out: Return view towards center
            newScale = Math.max(minScale, newScale);

            const stageCenter = {
                x: stageSize.width / 2,
                y: stageSize.height / 2,
            };
            const patternCenter = {
                x: patternSize.width / 2,
                y: patternSize.height / 2,
            }

            const newPos = {
                x: stageCenter.x - patternCenter.x * newScale,
                y: stageCenter.y - patternCenter.y * newScale,
            };

            stage.scale({ x: newScale, y: newScale });
            stage.position(newPos);
        }

        stage.batchDraw();
    }, [pattern.grids, pattern.options, styles, stageSize]);

    const handleOnStageTouchMove = useCallback((event: Konva.KonvaEventObject<TouchEvent>) => {
        event.evt.preventDefault();

        // NOTE: pinch gesture requires two fingers, otherwise it might be other gesture
        if (event.evt.touches.length !== 2) return;

        const [touchPoint1, touchPoint2] = event.evt.touches as unknown as [Touch, Touch];
        const currentTouchDistance = Math.hypot(
            touchPoint2.clientX - touchPoint1.clientX,
            touchPoint2.clientY - touchPoint1.clientY
        );

        if (lastTouchDistanceRef.current === 0) {
            lastTouchDistanceRef.current = currentTouchDistance;
            return;
        }

        const isZoomingOut = currentTouchDistance < lastTouchDistanceRef.current;

        const stage = stageRef.current;
        if (!stage) return;

        const pointerPosition = {
            x: (touchPoint1.clientX + touchPoint2.clientX) / 2,
            y: (touchPoint1.clientY + touchPoint2.clientY) / 2,
        }

        const stagePosition = stage.position();
        const patternSize = getPatternRenderSize(pattern.grids, styles, pattern.options);
        const patternCenter = getContentOffset(stageSize, patternSize);
        const minScale = getContentScale(stageSize, patternSize);
        const maxScale = SCALE_MAXIMUM;
        const oldScale = stage.scaleX();

        let newScale = oldScale * (currentTouchDistance / lastTouchDistanceRef.current);

        if (isZoomingOut) {
            // Zooming out: limit to minimum scale and gravitate toward rectangle center
            newScale = Math.max(minScale, newScale);

            // Calculate the interpolation factor
            const interpolationFactor = (newScale - minScale) / (oldScale - minScale);

            if (interpolationFactor > 0) {

                // Calculate the new position interpolated toward the center of the stage
                const newPosition = {
                    x: stagePosition.x + (patternCenter.x - stagePosition.x) * (1 - interpolationFactor),
                    y: stagePosition.y + (patternCenter.y - stagePosition.y) * (1 - interpolationFactor),
                };

                stage.position(newPosition);
            }
        }
        else {
            newScale = Math.min(maxScale, newScale);

            const targetPoint = getPointerOffset(pointerPosition, stagePosition, oldScale);
            const newPosition = calculateNewPosition(targetPoint, pointerPosition, newScale);

            stage.position(newPosition);
        }

        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();

        lastTouchDistanceRef.current = currentTouchDistance;
    }, [pattern.grids, pattern.options, stageSize, styles]);

    const handleOnStageTouchEnd = useCallback(() => {
        lastTouchDistanceRef.current = 0;
    }, []);

    const handleOnStageClick = useCallback(() => {
        // NOTE: clear all active selections when clicked on stage empty space
        setSelectedColumn(-1);
        setSelectedRow(-1);
        resetGridsSelection();
    }, [resetGridsSelection, setSelectedColumn, setSelectedRow]);

    const handleOnStageContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
    }, []);

    // SECTION: pattern event handlers
    const handleOnPatternColumnClick = useCallback((_event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
        setColumnState(columnState);
    }, []);

    const handleOnPatternRowClick = useCallback((_event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
        setRowState(rowState);
    }, []);

    const handleOnPatternContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
        const bbox = containerRef.current?.getBoundingClientRect();
        setMenuPosition({
            x: event.evt.pageX - (bbox?.left ?? 0),
            y: event.evt.pageY - (bbox?.top ?? 0)
        });
        onOpen();
    }, [containerRef, onOpen]);

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
    const handleOnGridCellPointerEnter = useCallback((_: BeadingGridState, event: BeadingPointerEvent) => {
        if (event.isPointerDown && isPencilEnabled) {
            dispatch(setBeadingGridCellAction({ ...event.cell, color: selectedColor }));
        }
        if (event.isPointerDown && isEraserEnabled) {
            dispatch(setBeadingGridCellAction({ ...event.cell, color: "" }));
        }
    }, [isPencilEnabled, isEraserEnabled, selectedColor, dispatch]);

    const isPointerDown = false;
    const handleOnGridSelectionChange = useCallback((source: unknown) => {
        if (isPointerDown && isCursorEnabled) {
            resetGridsSelection(source);
        }
    }, [isPointerDown, isCursorEnabled, resetGridsSelection]);

    const [startPosition, setStarPosition] = useState<Position>();
    const [endPosition, setEndPosition] = useState<Position>();
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleOnPointerDown = useCallback((event: KonvaEventObject<MouseEvent>) => {
        if (isCursorEnabled) {
            const stage = event.target.getStage();
            const position = stage?.getRelativePointerPosition() ?? { x: 0, y: 0 };
            setStarPosition(position);
            setEndPosition(undefined);
        }
        setIsMouseDown(true);
    }, [isCursorEnabled]);

    const handleOnPointerUp = useCallback((event: KonvaEventObject<MouseEvent>) => {
        if (isCursorEnabled) {
            const stage = event.target.getStage();
            const position = stage?.getRelativePointerPosition() ?? { x: 0, y: 0 };
            setEndPosition(position);
        }
        setIsMouseDown(false);
    }, [isCursorEnabled]);

    const handleOnPointerMove = useCallback((event: KonvaEventObject<MouseEvent>) => {
        if (isCursorEnabled && isMouseDown) {
            const stage = event.target.getStage();
            const position = stage?.getRelativePointerPosition() ?? { x: 0, y: 0 };
            setEndPosition(position);
        }
    }, [isCursorEnabled, isMouseDown]);

    return (
        <Box
            ref={containerRef}
            cursor={tool.name === "move"
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
                height={stageSize.height}
                width={stageSize.width}
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
                        <BeadingGridSelectionProvider>
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
                                            offset={isLayoutHorizontal
                                                ? { columnIndex: 1, rowIndex: -4 }
                                                : { columnIndex: -4, rowIndex: 0 }
                                            }
                                            options={grid.options}
                                        />
                                        <BeadingGridDivider
                                            length={isLayoutHorizontal
                                                ? getGridActualHeight(grid.options) + 4
                                                : grid.options.width + 4
                                            }
                                            offset={isLayoutHorizontal
                                                ? { columnIndex: 0, rowIndex: -4 }
                                                : { columnIndex: -4, rowIndex: 0 }
                                            }
                                            orientation={isLayoutHorizontal ? "vertical" : "horizontal"}
                                        />
                                    </BeadingGrid>
                                </BeadingGridProvider>
                            ))}
                        </BeadingGridSelectionProvider>

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
                                options={pattern.grids.at(0)?.options ?? DefaultGridProperties}

                                onColumnClick={handleOnPatternColumnClick}
                                onRowClick={handleOnPatternRowClick}
                                onContextMenu={handleOnPatternContextMenu}
                            />
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
                        <MenuItem color={"red.600"} onClick={handleOnGridDeleteRow}>
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
                        <MenuItem color={"red.600"} onClick={handleOnGridDeleteColumn}>
                            Delete column
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>
            {stageRef.current && createPortal(
                <Menu>
                    <MenuButton
                        as={Button}
                        colorScheme={"gray"}
                        rightIcon={<NavArrowDown />}
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
                        <MenuItem icon={<MediaImage />} onClick={handleOnPatternSavePngClick}>
                            Image (.png)
                        </MenuItem>
                        <MenuItem icon={<Page />} onClick={handleOnPatternSaveJsonClick}>
                            Pattern (.json)
                        </MenuItem>
                    </MenuList>
                </Menu>,
                document.getElementById("header-actions-group") as HTMLElement
            )}
        </Box>
    );
};

// type GridSelectionChangeEvent = {
//     selection: BeadingGridWindow;
// };

// type GridProps = {
//     grid: BeadingGridState;
//     metadata: BeadingGridMetadata;
//     onClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
//     onPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
//     onPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
//     onPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
//     onSelectionChange?: (source: BeadingGridState, event: GridSelectionChangeEvent) => void;
// };

// type GridStateRef = {
//     onResetSelection: () => void;
// };

// export const BeadingGridWrapper = forwardRef<GridStateRef, GridProps>(({
//     grid,
//     metadata,
//     onClick,
//     onPointerDown: onPointerDownCallback,
//     onPointerUp: onPointerUpCallback,
//     onPointerEnter: onPointerEnterCallback,
//     onSelectionChange
// }, ref) => {
//     const [startingCell, setStartingCell] = useState<BeadingGridOffset | undefined>();
//     const [selectedSection, setSelectedSection] = useState<BeadingGridWindow | undefined>();
//     const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

//     const { isPointerDown, onPointerDown, onPointerUp } = usePointerDisclosure();
//     const { selectedColor, setSelectedColor } = useColorPalette();
//     const { styles } = useGridStyles();
//     const { tool, setTool } = useTools();
//     const dispatch = usePatternStore(state => state.dispatch);

//     const isCursorEnabled = tool.name === "cursor";
//     const isMirroringEnabled = tool.name === "cursor" && tool.state.currentAction === "mirror";
//     const isDuplicatingEnabled = tool.name === "cursor" && tool.state.currentAction === "duplicate";
//     const showCentralArea = isCursorEnabled && selectedSection;
//     const showOtherAreas = (isMirroringEnabled || isDuplicatingEnabled) && selectedSection;

//     const onResetSelection = useCallback(() => {
//         setStartingCell(undefined);
//         setSelectedSection(undefined);
//     }, [setStartingCell, setSelectedSection]);

//     useImperativeHandle(ref, () => ({
//         onResetSelection
//     }));

//     const handleOnGridCellClick = useCallback((
//         source: BeadingGridState,
//         event: BeadingPointerEvent
//     ) => {
//         onClick?.(source, event);

//         if (tool.name === "pencil") {
//             dispatch(setBeadingGridCellAction(source.name, { ...event.cell, color: selectedColor }));
//         }
//         if (tool.name === "eraser") {
//             dispatch(setBeadingGridCellAction(source.name, { ...event.cell, color: CELL_BLANK_COLOR }));
//         }
//         if (tool.name === "picker") {
//             const existingCell = source.cells.find(cell =>
//                 cell.offset.rowIndex === event.cell.offset.rowIndex &&
//                 cell.offset.columnIndex === event.cell.offset.columnIndex
//             );
//             setSelectedColor(existingCell?.color ?? "");
//             setTool({ name: "pencil", state: { currentAction: "default" } });
//         }
//     }, [tool, setSelectedColor, setTool, onClick]);

//     const handleOnGridCellPointerDown = useCallback((
//         source: BeadingGridState,
//         event: BeadingPointerEvent
//     ) => {
//         onPointerDownCallback?.(source, event);
//         setStartingCell(event.cell.offset);
//         onPointerDown();
//     }, [onPointerDown, onPointerDownCallback]);

//     const handleOnGridCellPointerUp = useCallback((
//         source: BeadingGridState,
//         event: BeadingPointerEvent
//     ) => {
//         onPointerUpCallback?.(source, event);
//         onPointerUp();
//     }, [onPointerUp, onPointerUpCallback]);

//     const handleOnGridCellPointerEnter = useCallback((
//         source: BeadingGridState,
//         event: BeadingPointerEvent
//     ) => {
//         onPointerEnterCallback?.(source, event);

//         // if (isPointerDown && isCursorEnabled && startingCell) {
//         //     const selectedSection = getGridWindow(startingCell, event.cell.offset);

//         //     const renderSection = getGridSectionArea(source, styles.bead, selectedSection);
//         //     const TOOLBAR_OFFSET = 24;

//         //     const toolbarPositionX = renderSection.position.x + renderSection.width / 2;
//         //     let toolbarPositionY = renderSection.position.y - TOOLBAR_OFFSET;

//         //     if (toolbarPositionY < 0) toolbarPositionY = renderSection.position.y + renderSection.height + TOOLBAR_OFFSET;

//         //     setSelectedSection(selectedSection);
//         //     setToolbarPosition({ x: toolbarPositionX, y: toolbarPositionY });

//         //     onSelectionChange?.(source, { selection: selectedSection });
//         // }
//     }, [onPointerEnterCallback]);

//     const handleOnMirrorSelectionClick = useCallback(() => {
//         setTool?.({ name: "cursor", state: { currentAction: "mirror" } });
//     }, [setTool]);

//     const handleOnDuplicateSelectionClick = useCallback(() => {
//         setTool?.({ name: "cursor", state: { currentAction: "duplicate" } });
//     }, [setTool]);

//     const handleOnClearClick = useCallback(() => {
//         if (isMirroringEnabled && selectedSection) {
//             // dispatch(clearBeadingGridSectionAction(grid.name, selectedSection));
//         }
//     }, [isMirroringEnabled, selectedSection]);

//     const handleOnDoneClick = useCallback(() => {
//         setTool?.({ name: "pencil", state: { currentAction: "default" } });
//     }, [setTool]);

//     const onMirrorVerticalClick = (
//         event: KonvaEventObject<MouseEvent>,
//         target: BeadingGridWindow
//     ) => {
//         event.cancelBubble = true;

//         if (isMirroringEnabled && selectedSection) {
//             // dispatch(mirrorBeadingGridSectionAction(
//             //     grid.name,
//             //     target,
//             //     selectedSection,
//             //     "vertical"
//             // ));
//         }
//         if (isDuplicatingEnabled && selectedSection) {
//             // dispatch(duplicateBeadingGridSectionAction(grid.name, target, selectedSection));
//         }
//     };

//     const onMirrorHorizontalClick = (
//         event: KonvaEventObject<MouseEvent>,
//         target: BeadingGridWindow
//     ) => {
//         event.cancelBubble = true;

//         if (isMirroringEnabled && selectedSection) {
//             // dispatch(mirrorBeadingGridSectionAction(
//             //     grid.name,
//             //     target,
//             //     selectedSection,
//             //     "horizontal"
//             // ));
//         }
//         if (isDuplicatingEnabled && selectedSection) {
//             // dispatch(duplicateBeadingGridSectionAction(grid.name, target, selectedSection));
//         }
//     };

//     return (
//         <BeadingGrid
//             cells={grid.cells}
//             options={grid.options}
//             offset={metadata.offset}
//             onCellPointerDown={handleOnGridCellPointerDown}
//             onCellPointerUp={handleOnGridCellPointerUp}
//             onCellPointerEnter={handleOnGridCellPointerEnter}
//         >
//             {showCentralArea && (
//                 <HighlightedArea
//                     borderColor={FRAME_SELECTED_BORDER_COLOR}
//                     borderWidth={4}
//                     offset={selectedSection.offset}
//                     height={selectedSection.height}
//                     width={selectedSection.width}
//                     grid={grid}
//                 />
//             )}
//             {showOtherAreas && getGridWindowProjection(grid, selectedSection, "vertical").map((area, index) => (
//                 <HighlightedArea
//                     key={index}
//                     backgroundColor={FRAME_SELECTED_FILL_COLOR}
//                     borderColor={FRAME_SELECTED_BORDER_COLOR}
//                     borderWidth={2}
//                     offset={area.offset}
//                     height={area.height}
//                     width={area.width}
//                     grid={grid}
//                     onClick={(event) => onMirrorVerticalClick(event, area)}
//                 />
//             ))}
//             {showOtherAreas && getGridWindowProjection(grid, selectedSection, "horizontal").map((area, index) => (
//                 <HighlightedArea
//                     key={index}
//                     backgroundColor={FRAME_SELECTED_FILL_COLOR}
//                     borderColor={FRAME_SELECTED_BORDER_COLOR}
//                     borderWidth={2}
//                     offset={area.offset}
//                     height={area.height}
//                     width={area.width}
//                     grid={grid}
//                     onClick={(event) => onMirrorHorizontalClick(event, area)}
//                 />
//             ))}
//             {isCursorEnabled && selectedSection && (
//                 <Html
//                     groupProps={{ ...toolbarPosition }}
//                     transform
//                     transformFunc={attr => ({ ...attr, scaleX: 1, scaleY: 1 })}
//                 >
//                     <PatternActionToolbar
//                         tool={tool}
//                         onMirror={handleOnMirrorSelectionClick}
//                         onDuplicate={handleOnDuplicateSelectionClick}
//                         onClear={handleOnClearClick}
//                         onDone={handleOnDoneClick}
//                     />
//                 </Html>
//             )}
//         </BeadingGrid>
//     );
// });

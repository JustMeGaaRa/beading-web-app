import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {
    MediaImage,
    NavArrowDown,
    Page
} from "iconoir-react";
import {
    FC,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import {
    Layer,
    Stage,
} from "react-konva";
import { Html } from "react-konva-utils";
import { useParams } from "react-router";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    useColorPalette,
    useTools,
    getPatternMetadata,
    usePatternSelection,
    usePatternStore,
    PatternState,
    usePatterHistory,
    TextState,
    PatternFrame,
    CellBlankColor,
    BeadingGridState,
    BeadingGrid,
    FrameSelectedBorderColor,
    FrameSelectedFillColor,
    CellPixelRatio,
    getGridSectionRenderArea,
    getGridWindowProjection,
    getPatternRenderSize,
    GridOptionsProvider,
    DividerStrokeColor,
    GridDivider,
    GridText,
    HighlightedArea,
    BeadingGridOffset,
    BeadingGridWindow,
    getGridWindow,
    BeadingGridMetadata,
    usePointerDisclosure,
    BeadingPointerEvent,
    Shortcuts,
    useGridOptions,
    PatternActionToolbar,
    savePattern,
    putPattern,
    patternSelector,
    dirtyStateSelector,
} from "../components";
import {
    addBeadingGridColumnAfter,
    addBeadingGridColumnBefore,
    addBeadingGridRowBefore,
    clearBeadingGridColumn,
    clearBeadingGridRow,
    deleteBeadingGridColumn,
    deleteBeadingGridRow,
    setBeadingGridCell,
    mirrorBeadingGridSection,
    duplicateBeadingGridSection,
    clearBeadingGridSection,
} from "../components/pattern/creators"
import {
    applyTransform,
    calculateNewPosition,
    calculateNewScale,
    downloadUri,
    getPointerOffset,
    toJsonUri,
    ZOOM_FACTOR
} from "../utils";

const hotkeysOptions = { preventDefault: true };

export const PatternContainer: FC = () => {
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const stageLastDistanceRef = useRef(0);
    const gridRefs = useRef<Record<string, GridStateRef>>({});

    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | null>(null);
    const [rowState, setRowState] = useState<TextState | null>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isPointerDown, onPointerDown, onPointerUp } = usePointerDisclosure();
    
    const { patternId } = useParams();
    const { selectedColor } = useColorPalette();
    const { tool } = useTools();
    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);
    const {
        selectedColumn,
        selectedRow,
        setSelectedColumn,
        setSelectedRow
    } = usePatternSelection();
    const { undo, redo } = usePatterHistory();

    const isLayoutHorizontal = pattern.options.layout.orientation === "horizontal";
    const isMoveEnabled = tool.name === "move";
    const isCursorEnabled = tool.name === "cursor" && tool.state.currentAction === "default";
    const isPencilEnabled = tool.name === "pencil";
    const isEraserEnabled = tool.name === "eraser";

    const metadata = useMemo(() => getPatternMetadata(pattern, pattern.options), [pattern]);
    
    const onStageCentered = useCallback((pattern: PatternState) => {
        if (containerRef.current && stageRef.current && pattern?.grids.length > 0) {
            const size = getPatternRenderSize(pattern);
            const position = {
                x: containerRef.current.offsetWidth / 2 - size.width / 2,
                y: containerRef.current.offsetHeight / 2 - size.height / 2,
            };
            stageRef.current.position(position);
            stageRef.current.scale({ x: 1, y: 1 });
        }
    }, [containerRef.current, stageRef.current]);

    const onResetGridsSelection = useCallback((source?: BeadingGridState) => {
        Object
            .entries(gridRefs.current)
            .forEach(([name, ref]) => {
                if (name !== source?.name) {
                    ref.onResetSelection();
                }
            });
    }, [gridRefs]);

    useHotkeys(Shortcuts.patternCenter.keyString, () => onStageCentered(pattern), hotkeysOptions, [onStageCentered, pattern]);
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), hotkeysOptions, [undo]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), hotkeysOptions, [redo]);

    useEffect(() => {
        const resizeStage = () => {
            if (containerRef.current) {
                setStageSize({
                    height: containerRef.current.offsetHeight,
                    width: containerRef.current.offsetWidth,
                });
            }
        };

        resizeStage();
        window.addEventListener("resize", resizeStage);

        return () => window.removeEventListener("resize", resizeStage);
    }, [containerRef.current]);

    useEffect(() => {
        if (pattern) {
            putPattern(pattern);
            onStageCentered(pattern);
        }
        else {
            toast({
                title: "Pattern not found",
                description: "The pattern you are looking for does not exist.",
                status: "error",
                duration: 10000,
                position: "bottom-right",
                variant: "subtle",
                isClosable: true,
            });
        }
    }, [patternId]);

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

        const oldScale = stage.scaleX();
        const pointerPosition = stage.getPointerPosition();

        if (!pointerPosition) return;

        const newScale = calculateNewScale(oldScale, event.evt.deltaY, ZOOM_FACTOR);
        const pointerOffset = getPointerOffset(pointerPosition, stage, oldScale);
        const newPosition = calculateNewPosition(pointerOffset, pointerPosition, newScale);

        applyTransform(stage, newScale, newPosition);
    }, [stageRef]);

    const handleOnStageTouchMove = useCallback((event: Konva.KonvaEventObject<TouchEvent>) => {
        event.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        if (event.evt.touches.length !== 2) return;

        const [touch1, touch2] = event.evt.touches as any;
        const dist = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );

        if (stageLastDistanceRef.current === 0) {
            stageLastDistanceRef.current = dist;
            return;
        }

        const oldScale = stage.scaleX();
        const newScale = oldScale * (dist / stageLastDistanceRef.current);

        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();

        stageLastDistanceRef.current = dist;
    }, [stageRef]);

    const handleOnStageTouchEnd = useCallback(() => {
        stageLastDistanceRef.current = 0;
    }, []);

    const handleOnStageClick = useCallback(() => {
        setSelectedColumn(-1);
        setSelectedRow(-1);
        onResetGridsSelection();
    }, [setSelectedColumn, setSelectedRow, onResetGridsSelection]);

    const handleOnStageContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
    }, [onOpen]);

    // SECTION: pattern event handlers
    const handleOnPatternColumnClick = useCallback((_event: any, columnState: TextState) => {
        setColumnState(columnState);
    }, []);

    const handleOnPatternRowClick = useCallback((_event: any, rowState: TextState) => {
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
    }, [pattern, stageRef.current]);

    const handleOnPatternSaveJsonClick = useCallback(() => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [pattern]);

    const handleOnGridAddRowAbove = useCallback(() => {
        if (rowState) {
            dispatch(addBeadingGridRowBefore(rowState?.gridName, rowState?.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridAddRowBelow = useCallback(() => {
        if (rowState) {
            dispatch(addBeadingGridColumnAfter(rowState?.gridName, rowState?.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridClearRow = useCallback(() => {
        if (rowState) {
            dispatch(clearBeadingGridRow(rowState?.gridName, rowState?.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridDeleteRow = useCallback(() => {
        if (rowState) {
            dispatch(deleteBeadingGridRow(rowState?.gridName, rowState?.gridIndex));
        }
    }, [rowState, dispatch]);

    const handleOnGridAddColumnLeft = useCallback(() => {
        if (columnState) {
            dispatch(addBeadingGridColumnBefore(columnState?.gridName, columnState?.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridAddColumnRight = useCallback(() => {
        if (columnState) {
            dispatch(addBeadingGridColumnAfter(columnState?.gridName, columnState?.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridClearColumn = useCallback(() => {
        if (columnState) {
            dispatch(clearBeadingGridColumn(columnState?.gridName, columnState?.gridIndex));
        }
    }, [columnState, dispatch]);

    const handleOnGridDeleteColumn = useCallback(() => {
        if (columnState) {
            dispatch(deleteBeadingGridColumn(columnState?.gridName, columnState?.gridIndex));
        }
    }, [columnState, dispatch]);

    // SECTION: grid event handlers
    const handleOnGridCellPointerDown = useCallback(() => {
        onPointerDown();
    }, [onPointerDown]);

    const handleOnGridCellPointerUp = useCallback(() => {
        onPointerUp();
    }, [onPointerUp]);

    const handleOnGridCellPointerEnter = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        if (isPointerDown && isPencilEnabled) {
            dispatch(setBeadingGridCell(source.name, { ...event.cell, color: selectedColor }));
        }
        if (isPointerDown && isEraserEnabled) {
            dispatch(setBeadingGridCell(source.name, { ...event.cell, color: CellBlankColor }));
        }
    }, [isPointerDown, isPencilEnabled, isEraserEnabled, dispatch]);

    const handleOnGridSelectionChange = useCallback((source: BeadingGridState) => {
        if (isPointerDown && isCursorEnabled) {
            onResetGridsSelection(source);
        }
    }, [isPointerDown, isCursorEnabled, onResetGridsSelection]);

    return (
        <Box
            ref={containerRef}
            cursor={tool.name === "cursor" ? "crosshair" : "cursor"}
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
                onWheel={handleOnStageWheel}
            >
                <Layer>
                    {pattern.grids.map((grid) => (
                        <GridOptionsProvider
                            key={grid.name}
                            cellHeight={grid.options.type === "brick"
                                ? pattern.options.layout.beadSize.width
                                : pattern.options.layout.beadSize.height
                            }
                            cellWidth={grid.options.type === "brick"
                                ? pattern.options.layout.beadSize.height
                                : pattern.options.layout.beadSize.width
                            }
                            pointPixelRatio={CellPixelRatio}
                        >
                            <BeadingGridWrapper
                                ref={(ref) => (ref && (gridRefs.current[grid.name] = ref))}
                                grid={grid}
                                metadata={metadata.grids[grid.name]}
                                onPointerDown={handleOnGridCellPointerDown}
                                onPointerUp={handleOnGridCellPointerUp}
                                onPointerEnter={handleOnGridCellPointerEnter}
                                onSelectionChange={handleOnGridSelectionChange}
                            />
                            <GridText
                                color={DividerStrokeColor}
                                offset={metadata.grids[grid.name].text}
                                padding={6}
                                text={grid.name}
                            />
                            <GridDivider
                                length={metadata.grids[grid.name].divider.length}
                                offset={metadata.grids[grid.name].divider.offset}
                                orientation={isLayoutHorizontal ? "vertical" : "horizontal"}
                                strokeColor={DividerStrokeColor}
                                strokeWidth={1}
                            />
                        </GridOptionsProvider>
                    ))}
                    {pattern.grids.length > 0 && (
                        <PatternFrame
                            pattern={pattern}
                            options={pattern.options}
                            onColumnClick={handleOnPatternColumnClick}
                            onRowClick={handleOnPatternRowClick}
                            onContextMenu={handleOnPatternContextMenu}
                        />
                    )}
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
                document.getElementById("header-actions-group") as any
            )}
        </Box>
    );
};

type GridSelectionChangeEvent = {
    selection: BeadingGridWindow;
};

type GridProps = {
    grid: BeadingGridState;
    metadata: BeadingGridMetadata;
    onClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onSelectionChange?: (source: BeadingGridState, event: GridSelectionChangeEvent) => void;
};

type GridStateRef = {
    onResetSelection: () => void;
};

const BeadingGridWrapper = forwardRef<GridStateRef, GridProps>(({
    grid,
    metadata,
    onClick,
    onPointerDown: onPointerDownCallback,
    onPointerUp: onPointerUpCallback,
    onPointerEnter: onPointerEnterCallback,
    onSelectionChange
}, ref) => {
    const [startingCell, setStartingCell] = useState<BeadingGridOffset | undefined>();
    const [selectedSection, setSelectedSection] = useState<BeadingGridWindow | undefined>();
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    
    const { isPointerDown, onPointerDown, onPointerUp } = usePointerDisclosure();
    const { selectedColor, setSelectedColor } = useColorPalette();
    const { cellHeight, cellWidth } = useGridOptions();
    const { tool, setTool } = useTools();
    const dispatch = usePatternStore(state => state.dispatch);

    const isCursorEnabled = tool.name === "cursor" && tool.state.currentAction === "default";
    const isMirroringEnabled = tool.name === "cursor" && tool.state.currentAction === "mirror";
    const isDuplicatingEnabled = tool.name === "cursor" && tool.state.currentAction === "duplicate";
    const showCentralArea = isCursorEnabled && selectedSection;
    const showOtherAreas = (isMirroringEnabled || isDuplicatingEnabled) && selectedSection;

    const onResetSelection = useCallback(() => {
        setStartingCell(undefined);
        setSelectedSection(undefined);
    }, [setStartingCell, setSelectedSection]);

    useImperativeHandle(ref, () => ({
        onResetSelection
    }));
    
    const handleOnGridCellClick = useCallback((
        source: BeadingGridState,
        event: BeadingPointerEvent
    ) => {
        onClick?.(source, event);

        if (tool.name === "pencil") {
            dispatch(setBeadingGridCell(source.name, { ...event.cell, color: selectedColor }));
        }
        if (tool.name === "eraser") {
            dispatch(setBeadingGridCell(source.name, { ...event.cell, color: CellBlankColor }));
        }
        if (tool.name === "picker") {
            setSelectedColor(source.rows[event.cell.offset.rowIndex].cells[event.cell.offset.columnIndex]);
            setTool({ name: "pencil", state: { currentAction: "default" } });
        }
    }, [tool, selectedColor, dispatch, setSelectedColor, setTool, onClick]);

    const handleOnGridCellPointerDown = useCallback((
        source: BeadingGridState,
        event: BeadingPointerEvent
    ) => {
        onPointerDownCallback?.(source, event);
        setStartingCell(event.cell.offset);
        onPointerDown();
    }, [onPointerDown, onPointerDownCallback]);

    const handleOnGridCellPointerUp = useCallback((
        source: BeadingGridState,
        event: BeadingPointerEvent
    ) => {
        onPointerUpCallback?.(source, event);
        onPointerUp();
    }, [onPointerUp, onPointerUpCallback]);

    const handleOnGridCellPointerEnter = useCallback((
        source: BeadingGridState,
        event: BeadingPointerEvent
    ) => {
        onPointerEnterCallback?.(source, event);
        
        if (isPointerDown && isCursorEnabled && startingCell) {
            const selectedSection = getGridWindow(startingCell, event.cell.offset);

            const beadSize = { height: cellHeight, width: cellWidth };
            const renderSection = getGridSectionRenderArea(source, beadSize, selectedSection);
            
            const toolbarPositionX = renderSection.position.x + renderSection.width / 2;
            const toolbarPositionY = renderSection.position.y - 20;
            
            setSelectedSection(selectedSection);
            setToolbarPosition({ x: toolbarPositionX, y: toolbarPositionY });

            onSelectionChange?.(source, { selection: selectedSection });
        }
    }, [isCursorEnabled, isPointerDown, onPointerEnterCallback, setBeadingGridCell]);

    const handleOnMirrorSelectionClick = useCallback(() => {
        setTool?.({ name: "cursor", state: { currentAction: "mirror" } });
    }, [setTool]);

    const handleOnDuplicateSelectionClick = useCallback(() => {
        setTool?.({ name: "cursor", state: { currentAction: "duplicate" } });
    }, [setTool]);

    const handleOnClearClick = useCallback(() => {
        if (isMirroringEnabled && selectedSection) {
            dispatch(clearBeadingGridSection(grid.name, selectedSection));
        }
    }, [dispatch, grid.name, selectedSection]);

    const handleOnDoneClick = useCallback(() => {
        setTool?.({ name: "pencil", state: { currentAction: "default" } });
    }, [setTool]);

    const onMirrorVerticalClick = (
        event: KonvaEventObject<MouseEvent>,
        target: BeadingGridWindow
    ) => {
        event.cancelBubble = true;

        if (isMirroringEnabled && selectedSection) {
            dispatch(mirrorBeadingGridSection(
                grid.name,
                target,
                selectedSection,
                "vertical"
            ));
        }
        if (isDuplicatingEnabled && selectedSection) {
            dispatch(duplicateBeadingGridSection(grid.name, target, selectedSection));
        }
    };

    const onMirrorHorizontalClick = (
        event: KonvaEventObject<MouseEvent>,
        target: BeadingGridWindow
    ) => {
        event.cancelBubble = true;

        if (isMirroringEnabled && selectedSection) {
            dispatch(mirrorBeadingGridSection(
                grid.name,
                target,
                selectedSection,
                "horizontal"
            ));
        }
        if (isDuplicatingEnabled && selectedSection) {
            dispatch(duplicateBeadingGridSection(grid.name, target, selectedSection));
        }
    };

    return (
        <BeadingGrid
            grid={grid}
            offset={metadata.offset}
            onCellClick={handleOnGridCellClick}
            onCellPointerDown={handleOnGridCellPointerDown}
            onCellPointerUp={handleOnGridCellPointerUp}
            onCellPointerEnter={handleOnGridCellPointerEnter}
        >
            {showCentralArea && (
                <HighlightedArea
                    borderColor={FrameSelectedBorderColor}
                    borderWidth={4}
                    offset={selectedSection.offset}
                    height={selectedSection.height}
                    width={selectedSection.width}
                    grid={grid}
                />
            )}
            {showOtherAreas && getGridWindowProjection(grid, selectedSection, "vertical").map((area, index) => (
                <HighlightedArea
                    key={index}
                    backgroundColor={FrameSelectedFillColor}
                    borderColor={FrameSelectedBorderColor}
                    borderWidth={2}
                    offset={area.offset}
                    height={area.height}
                    width={area.width}
                    grid={grid}
                    onClick={(event) => onMirrorVerticalClick(event, area)}
                />
            ))}
            {showOtherAreas && getGridWindowProjection(grid, selectedSection, "horizontal").map((area, index) => (
                <HighlightedArea
                    key={index}
                    backgroundColor={FrameSelectedFillColor}
                    borderColor={FrameSelectedBorderColor}
                    borderWidth={2}
                    offset={area.offset}
                    height={area.height}
                    width={area.width}
                    grid={grid}
                    onClick={(event) => onMirrorHorizontalClick(event, area)}
                />
            ))}
            {isCursorEnabled && selectedSection && (
                <Html
                    groupProps={{ ...toolbarPosition }}
                    transform
                    transformFunc={attr => ({ ...attr, scaleX: 1, scaleY: 1 })}
                >
                    <PatternActionToolbar
                        tool={tool}
                        onMirror={handleOnMirrorSelectionClick}
                        onDuplicate={handleOnDuplicateSelectionClick}
                        onClear={handleOnClearClick}
                        onDone={handleOnDoneClick}
                    />
                </Html>
            )}
        </BeadingGrid>
    );
});

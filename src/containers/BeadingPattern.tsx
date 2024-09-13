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
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    Layer,
    Stage,
} from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
    useColorPalette,
    useTools,
    getPatternMetadata,
    usePatternSelection,
    usePatternStore,
    PatternState,
    usePatternCollection,
    usePatterHistory,
    TextState,
    PatternFrame,
    CellBlankColor,
    BeadingGridState,
    BeadingPointerEvent,
    BeadingGrid,
    FrameSelectedBorderColor,
    FrameSelectedFillColor,
    CellPixelRatio,
    getGridSectionRenderArea,
    getGridMirrorSections,
    getPatternRenderSize,
    GridOptionsProvider,
    DividerStrokeColor,
    GridDivider,
    GridText,
    HighlightedArea,
    GridSection,
    GridMirrorSections,
    GridCellPosition,
} from "../components";
import {
    Shortcuts,
    usePattern,
} from "../components";
import { downloadUri, toJsonUri } from "../utils";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router";
import { PatternActionToolbar } from "./PatternActionToolbar";

const ZOOM_FACTOR = 1.1;

const calculateNewScale = (
    currentScale: number,
    deltaY: number,
    scaleBy: number
) => {
    return deltaY > 0
        ? currentScale / scaleBy
        : currentScale * scaleBy;
};

const getPointerOffset = (
    pointerPosition: Konva.Vector2d,
    stage: Konva.Stage,
    scale: number
) => {
    return {
        x: (pointerPosition.x - stage.x()) / scale,
        y: (pointerPosition.y - stage.y()) / scale,
    };
};

const calculateNewPosition = (
    pointerOffset: Konva.Vector2d,
    pointerPosition: Konva.Vector2d,
    scale: number
) => {
    return {
        x: pointerPosition.x - pointerOffset.x * scale,
        y: pointerPosition.y - pointerOffset.y * scale,
    };
};

const applyTransform = (
    stage: Konva.Stage,
    scale: number,
    position: Konva.Vector2d
) => {
    stage.scale({ x: scale, y: scale });
    stage.position(position);
    stage.batchDraw();
};

const isInBounds = (rowIndex: number, columnIndex: number, size: { width: number; height: number }) => {
    return columnIndex >= 0 && rowIndex >= 0 && columnIndex < size.width && rowIndex < size.height;
};

const getCellFromPointerPosition = (stage: Konva.Stage | null, pattern: PatternState) => {
    if (!stage) return undefined;

    const pointerPosition = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    
    if (!stageTransform || !pointerPosition) return undefined;

    const stagePointerPosition = stageTransform.point(pointerPosition);

    const columnIndex = Math.floor(stagePointerPosition.x / pattern.options.layout.beadSize.width / CellPixelRatio);
    const rowIndex = Math.floor(stagePointerPosition.y / pattern.options.layout.beadSize.height / CellPixelRatio);
    
    const patternSize = getPatternRenderSize(pattern, pattern.options);

    if (!isInBounds(rowIndex, columnIndex, patternSize)) return undefined;

    return { columnIndex, rowIndex };
}

export const BeadingPattern: FC = () => {
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const stageLastDistanceRef = useRef(0);
    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | null>(null);
    const [rowState, setRowState] = useState<TextState | null>();
    const [startingCell, setStartingCell] = useState<GridCellPosition | undefined>();
    const [gridMirrorSections, setGridMirrorSections] = useState<GridMirrorSections | undefined>();
    const { patternId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        pattern,
        setPattern,
        setPatternCover,
        setGridCell,
        addGridColumnLeft,
        addGridColumnRight,
        clearGridColumn,
        deleteGridColumn,
        addGridRowAbove,
        addGridRowBelow,
        clearGridRow,
        deleteGridRow,
        setGridSection
    } = usePattern();
    const { patterns } = usePatternCollection();
    const {
        selectedColumn,
        selectedRow,
        setSelectedCells,
        setSelectedColumn,
        setSelectedRow
    } = usePatternSelection();
    const { isDirty } = usePatternStore();
    const { undo, redo } = usePatterHistory();
    const { tool, setTool } = useTools();
    const { selectedColor, setSelectedColor } = useColorPalette();

    const metadata = useMemo(() => getPatternMetadata(pattern, pattern.options), [pattern]);
    
    const setStageCentered = useCallback((pattern: PatternState) => {
        if (containerRef.current && stageRef.current && pattern?.grids.length > 0) {
            const size = getPatternRenderSize(pattern, pattern.options);
            const position = {
                x: containerRef.current.offsetWidth / 2 - size.width / 2,
                y: containerRef.current.offsetHeight / 2 - size.height / 2,
            };
            stageRef.current.position(position);
            stageRef.current.scale({ x: 1, y: 1 });
        }
    }, [containerRef.current, stageRef.current]);

    useHotkeys(Shortcuts.patternCenter.keyString, () => setStageCentered(pattern), { preventDefault: true }, [setStageCentered, pattern]);
    useHotkeys(Shortcuts.patternUndo.keyString, () => undo(), { preventDefault: true }, [undo]);
    useHotkeys(Shortcuts.patternRedo.keyString, () => redo(), { preventDefault: true }, [redo]);

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
        // NOTE: intialize pattern from URL
        const pattern = patterns.find((pattern) => pattern.patternId === patternId);

        if (pattern) {
            setPattern(pattern);
            setStageCentered(pattern);
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
                setPatternCover(imageUri);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [stageRef.current, isDirty, setPatternCover]);

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
        setSelectedCells({})
        setSelectedColumn(-1);
        setSelectedRow(-1);
        setGridMirrorSections(undefined);
    }, [setSelectedCells, setSelectedColumn, setSelectedRow]);

    const handleOnStageContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
    }, [onOpen]);

    // SECTION: pattern event handlers
    const handleOnPatternColumnClick = useCallback((event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
        setColumnState(columnState);
    }, []);

    const handleOnPatternRowClick = useCallback((event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
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

    // SECTION: grid event handlers
    const handleOnGridCellClick = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        if (tool.name === "pencil") {
            setGridCell(source.name, { ...event.cell, color: selectedColor });
        }
        if (tool.name === "eraser") {
            setGridCell(source.name, { ...event.cell, color: CellBlankColor });
        }
        if (tool.name === "picker") {
            setSelectedColor(source.rows[event.cell.rowIndex].cells[event.cell.columnIndex]);
            setTool({ name: "pencil", state: { currentAction: "default" } });
        }
    }, [tool, selectedColor, setSelectedColor]);

    const handleOnGridCellPointerDown = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        setIsPointerDown(true);
        setStartingCell(event.cell);
    }, [tool, setStartingCell]);

    const handleOnGridCellPointerUp = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        setIsPointerDown(false);
    }, [tool]);

    const handleOnGridCellPointerEnter = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        if (isPointerDown) {
            if (tool.name === "pencil") {
                setGridCell(source.name, { ...event.cell, color: selectedColor });
            }
            if (tool.name === "eraser") {
                setGridCell(source.name, { ...event.cell, color: CellBlankColor });
            }
            if (tool.name === "cursor" && tool.state.currentAction === "default" && startingCell) {
                const gridSection = getGridMirrorSections(source, startingCell, event.cell);
                setGridMirrorSections(gridSection);

                const beadSize = pattern.options.layout.beadSize;
                const gridHighlightArea = getGridSectionRenderArea(source, beadSize, gridSection.center);
                
                const toolbarPositionX = (stageRef.current?.x() ?? 0)
                    + gridHighlightArea.position.x
                    + gridHighlightArea.width / 2;
                const toolbarPositionY = (stageRef.current?.y() ?? 0)
                    + gridHighlightArea.position.y;
                
                setToolbarPosition({ x: toolbarPositionX, y: toolbarPositionY });
            }
        }
    }, [tool, isPointerDown, setGridCell]);

    const handleOnGridAddRowAbove = useCallback(() => {
        if (rowState) {
            addGridRowAbove(rowState?.gridName, rowState?.gridIndex);
        }
    }, [columnState, addGridRowAbove]);

    const handleOnGridAddRowBelow = useCallback(() => {
        if (rowState) {
            addGridRowBelow(rowState?.gridName, rowState?.gridIndex);
        }
    }, [rowState, addGridRowBelow]);

    const handleOnGridClearRow = useCallback(() => {
        if (rowState) {
            clearGridRow(rowState?.gridName, rowState?.gridIndex);
        }
    }, [rowState, clearGridRow]);

    const handleOnGridDeleteRow = useCallback(() => {
        if (rowState) {
            deleteGridRow(rowState?.gridName, rowState?.gridIndex);
        }
    }, [rowState, deleteGridRow]);

    const handleOnGridAddColumnLeft = useCallback(() => {
        if (columnState) {
            addGridColumnLeft(columnState?.gridName, columnState?.gridIndex);
        }
    }, [columnState, addGridColumnLeft]);

    const handleOnGridAddColumnRight = useCallback(() => {
        if (columnState) {
            addGridColumnRight(columnState?.gridName, columnState?.gridIndex);
        }
    }, [columnState, addGridColumnRight]);

    const handleOnGridClearColumn = useCallback(() => {
        if (columnState) {
            clearGridColumn(columnState?.gridName, columnState?.gridIndex);
        }
    }, [columnState, clearGridColumn]);

    const handleOnGridDeleteColumn = useCallback(() => {
        if (columnState) {
            deleteGridColumn(columnState?.gridName, columnState?.gridIndex);
        }
    }, [columnState, deleteGridColumn]);

    const handleOnMirrorAreaClick = useCallback((event: KonvaEventObject<MouseEvent>, grid: BeadingGridState, section: GridSection) => {
        event.cancelBubble = true;
        setGridSection(grid.name, section, section.topLeft);
    }, [setGridSection]);

    const isLayoutHorizontal = pattern.options.layout.orientation === "horizontal";
    const isCursorEnabled = tool.name === "cursor";
    const isMirroringEnabled = tool.name === "cursor" && tool.state.currentAction === "mirror";

    return (
        <Box
            ref={containerRef}
            cursor={tool.name === "cursor" ? "crosshair" : "cursor"}
            height={"100%"}
            width={"100%"}
        >
            <Stage
                ref={stageRef}
                height={stageSize.height}
                width={stageSize.width}
                onClick={handleOnStageClick}
                onContextMenu={handleOnStageContextMenu}
                onTouchMove={handleOnStageTouchMove}
                onTouchEnd={handleOnStageTouchEnd}
                onWheel={handleOnStageWheel}
            >
                <Layer >
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
                            <BeadingGrid
                                grid={grid}
                                offset={metadata.grids[grid.name].offset}
                                beadSize={pattern.options.layout.beadSize}
                                onBeadingClick={handleOnGridCellClick}
                                onBeadingPointerDown={handleOnGridCellPointerDown}
                                onBeadingPointerUp={handleOnGridCellPointerUp}
                                onBeadingPointerEnter={handleOnGridCellPointerEnter}
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
                            {isCursorEnabled && gridMirrorSections?.center && (
                                <HighlightedArea
                                    borderColor={FrameSelectedBorderColor}
                                    borderWidth={4}
                                    offset={gridMirrorSections?.center.topLeft}
                                    height={gridMirrorSections?.center.height}
                                    width={gridMirrorSections?.center.width}
                                />
                            )}
                            {isMirroringEnabled && gridMirrorSections?.mirrors.map((area, index) => (
                                <HighlightedArea
                                    key={index}
                                    backgroundColor={FrameSelectedFillColor}
                                    borderColor={FrameSelectedBorderColor}
                                    borderWidth={2}
                                    offset={area.topLeft}
                                    height={area.height}
                                    width={area.width}
                                    onClick={(event) => handleOnMirrorAreaClick(event, grid, area)}
                                />
                            ))}
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
            {tool.name === "cursor" && (
                <PatternActionToolbar
                    left={toolbarPosition.x}
                    top={toolbarPosition.y}
                />
            )}
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

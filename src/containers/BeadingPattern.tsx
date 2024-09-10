import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useDisclosure
} from "@chakra-ui/react";
import {
    MediaImage,
    NavArrowDown,
    Page
} from "iconoir-react";
import {
    FC,
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    Circle,
    Group,
    Layer,
    Line,
    Rect,
    Stage,
    Text,
} from "react-konva";
import Konva from "konva";
import {
    useColorPalette,
    useTools,
    BeadSize,
    BeadingGridState,
    getPatternMetadata,
    PatternOptions,
    FrameTextColor,
    getPatternSize,
    FrameSelectedColor,
    usePatternSelection,
    usePatternStore,
    BeadingGridMetadata,
    PatternState,
} from "../components";
import {
    CellBlankColor,
    CellDotColor,
    CellPixelRatio,
    CellStrokeColor,
    DividerStrokeColor,
    usePattern,
    isNullOrEmpty,
} from "../components";
import { KonvaEventObject } from "konva/lib/Node";
import { downloadUri, toJsonUri } from "../utils";

type BeadingPointerEvent = {
    row: number;
    column: number;
    x?: number;
    y?: number;
};

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

export const BeadingPattern: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const lastDist = useRef(0);
    const [stageSize, setStageSize] = useState({ height: 0, width: 0 });
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [columnState, setColumnState] = useState<TextState | null>(null);
    const [rowState, setRowState] = useState<TextState | null>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        pattern,
        setPatternCover,
        setGridCellColor,
        addGridColumnLeft,
        addGridColumnRight,
        clearGridColumn,
        deleteGridColumn,
        addGridRowAbove,
        addGridRowBelow,
        clearGridRow,
        deleteGridRow,
    } = usePattern();
    const {
        selectedCells,
        selectedColumn,
        selectedRow,
        setSelectedCells,
        setSelectedColumn,
        setSelectedRow
    } = usePatternSelection();
    const { isDirty } = usePatternStore();
    const { selectedTool } = useTools();
    const { selectedColor, setSelectedColor } = useColorPalette();

    useLayoutEffect(() => {
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

        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, [containerRef.current]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isDirty) {
                const imageUri = stageRef.current?.toDataURL() ?? "";
                setPatternCover(imageUri);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [stageRef.current, isDirty, setPatternCover]);

    const metadata = useMemo(() => getPatternMetadata(pattern, pattern.options), [pattern]);

    const handleOnBeadingClick = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        const { row, column } = event;

        if (selectedTool === "cursor") {
            setSelectedCells([{ row: event.row, column: event.column }]);
        }
        if (selectedTool === "pencil") {
            setGridCellColor(source.name, { row, column, color: selectedColor });
        }
        if (selectedTool === "eraser") {
            setGridCellColor(source.name, { row, column, color: CellBlankColor });
        }
        if (selectedTool === "picker") {
            setSelectedColor(source.rows[row].cells[column]);
        }
    }, [selectedTool, selectedColor, setSelectedColor]);

    const handleOnBeadingPointerDown = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        setIsPointerDown(true);
    }, []);

    const handleOnBeadingPointerUp = useCallback(() => {
        setIsPointerDown(false);
    }, []);

    const handleOnBeadingPointerEnter = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        if (isPointerDown) {
            if (selectedTool === "pencil") {
                setGridCellColor(source.name, {
                    row: event.row,
                    column: event.column,
                    color: selectedColor,
                });
            }
            if (selectedTool === "eraser") {
                setGridCellColor(source.name, {
                    row: event.row,
                    column: event.column,
                    color: CellBlankColor,
                });
            }
        }
    }, [isPointerDown, setGridCellColor]);

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

        if (lastDist.current === 0) {
            lastDist.current = dist;
            return;
        }

        const oldScale = stage.scaleX();
        const newScale = oldScale * (dist / lastDist.current);

        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();

        lastDist.current = dist;
    }, [stageRef]);

    const handleOnStageTouchEnd = useCallback(() => {
        lastDist.current = 0;
    }, []);

    const handleOnStageClick = useCallback(() => {
        setSelectedColumn(-1);
        setSelectedRow(-1);
    }, [setSelectedColumn, setSelectedRow]);

    const handleOnStageContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        event.evt.preventDefault();
    }, [onOpen]);

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

    const handleOnSaveImageClick = useCallback(() => {
        const imageUri = stageRef.current?.toDataURL() ?? "";
        downloadUri(imageUri, `${pattern.name}.png`);
    }, [pattern, stageRef.current]);

    const handleOnSavePatternClick = useCallback(() => {
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${pattern.name}.json`);
    }, [pattern]);

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

    return (
        <Box
            cursor={selectedTool === "drag"
                ? "move"
                : selectedTool === "cursor"
                    ? "cell"
                    : "cursor"
            }
            height={"100%"}
            width={"100%"}
            ref={containerRef}
        >
            <Stage
                ref={stageRef}
                draggable={selectedTool === "drag"}
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
                        <BeadingGrid
                            key={grid.name}
                            grid={grid}
                            metadata={metadata.grids[grid.name]}
                            position={metadata.grids[grid.name].position}
                            beadSize={pattern.options.layout.beadSize}
                            onBeadingClick={handleOnBeadingClick}
                            onBeadingPointerDown={handleOnBeadingPointerDown}
                            onBeadingPointerUp={handleOnBeadingPointerUp}
                            onBeadingPointerEnter={handleOnBeadingPointerEnter}
                        />
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
                    {selectedCells && selectedCells.length > 0 && (
                        <Rect
                            stroke={FrameSelectedColor}
                            strokeWidth={2}
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
                    >
                        Save As
                    </MenuButton>
                    <MenuList zIndex={1000}>
                        <MenuItem icon={<MediaImage />} onClick={handleOnSaveImageClick}>
                            Image (.png)
                        </MenuItem>
                        <MenuItem icon={<Page />} onClick={handleOnSavePatternClick}>
                            Pattern (.json)
                        </MenuItem>
                    </MenuList>
                </Menu>,
                document.getElementById("header-actions-group") as any
            )}
        </Box>
    );
};

type TextState = {
    gridName: string;
    gridIndex: number;
    patternIndex: number;
}

const PatternFrame: FC<{
    pattern: PatternState;
    options: PatternOptions;
    onColumnClick?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
    onRowClick?: (event: KonvaEventObject<MouseEvent>, rowState: TextState) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    pattern,
    options,
    onColumnClick,
    onRowClick,
    onContextMenu,
}) => {
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow} = usePatternSelection();

    const cellHeight = pattern.grids.some((grid) => grid.options.type === "brick")
        ? options.layout.beadSize.width * CellPixelRatio
        : options.layout.beadSize.height * CellPixelRatio;
    const cellWidth = pattern.grids.some((grid) => grid.options.type === "brick")
        ? options.layout.beadSize.height * CellPixelRatio
        : options.layout.beadSize.width * CellPixelRatio;

    const { height: rows, width: columns } = getPatternSize(pattern, pattern.options);
    
    const frameMarginX = cellWidth / 2;
    const frameMarginY = cellHeight / 4;

    const frameTextOffsetX = cellWidth + frameMarginX;
    const frameTextOffsetY = cellHeight + frameMarginY;

    const selectedColumnPositionX = selectedColumn * cellWidth;
    const selectedColumnPositionY = -frameTextOffsetY;
    const selectedColumnHeight = cellHeight * rows + 2 * frameTextOffsetY;
    const selectedColumnWidth = cellWidth;

    const selectedRowPositionX = -frameTextOffsetX;
    const selectedRowPositionY = selectedRow * cellHeight;
    const selectedRowHeight = cellHeight;
    const selectedRowWidth = cellWidth * columns + 2 * frameTextOffsetX;

    const handleOnRowClick = useCallback((event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
        event.evt.preventDefault();
        event.cancelBubble = true;
        setSelectedColumn(-1);
        setSelectedRow(rowState.patternIndex);
        onRowClick?.(event, rowState);
    }, [setSelectedColumn, setSelectedRow, onRowClick]);

    const handleOnColumnClick = useCallback((event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
        event.evt.preventDefault();
        event.cancelBubble = true;
        setSelectedColumn(columnState.patternIndex);
        setSelectedRow(-1);
        onColumnClick?.(event, columnState);
    }, [setSelectedColumn, setSelectedRow, onColumnClick]);

    const isHorizontal = pattern.options.layout.orientation === "horizontal";
    const columnsTextArray: Array<TextState> = isHorizontal
        ? pattern.grids
            .flatMap((grid) => 
                grid.rows[0].cells.map((_, columnIndex) => 
                    ({ gridIndex: columnIndex, gridName: grid.name })
            ))
            .map((columnState, columnIndex) => ({ ...columnState, patternIndex: columnIndex }))
        : Array.from({ length: columns }, (_, index) => 
            ({ gridIndex: index, gridName: "all", patternIndex: index })
        );
    const rowTextArray: Array<TextState> = isHorizontal
        ? Array.from({ length: rows }, (_, index) => 
            ({ gridIndex: index, gridName: "all", patternIndex: index })
        )
        : pattern.grids
            .flatMap((grid) => 
                grid.rows.map((_, rowIndex) => 
                    ({ gridIndex: rowIndex, gridName: grid.name })
            ))
            .map((rowState, rowIndex) => ({ ...rowState, patternIndex: rowIndex }))
    
    return (
        <Group>
            {columnsTextArray.map((column) => (
                <Fragment key={`column-number-${column.patternIndex}`}>
                    <Text
                        key={`column-top-number-${column.patternIndex}`}
                        align={"center"}
                        fill={FrameTextColor}
                        height={cellHeight}
                        text={(column.patternIndex + 1).toString()}
                        verticalAlign={"middle"}
                        width={cellWidth}
                        x={column.patternIndex * cellWidth}
                        y={-frameTextOffsetY}
                        onClick={(event) => handleOnColumnClick(event, column)}
                        onContextMenu={onContextMenu}
                    />
                    <Text
                        key={`column-bottom-number-${column.patternIndex}`}
                        align={"center"}
                        fill={FrameTextColor}
                        height={cellHeight} 
                        text={(column.patternIndex + 1).toString()}
                        verticalAlign={"middle"}
                        width={cellWidth}
                        x={column.patternIndex * cellWidth}
                        y={rows * cellHeight + frameMarginY}
                        onClick={(event) => handleOnColumnClick(event, column)}
                        onContextMenu={onContextMenu}
                    />
                </Fragment>
            ))}
            {rowTextArray.map((row) => (
                <Fragment key={`row-number-${row.patternIndex}`}>
                    <Text
                        key={`row-left-number-${row.patternIndex}`}
                        align={"right"}
                        fill={FrameTextColor}
                        height={cellHeight}
                        text={(row.patternIndex + 1).toString()}
                        verticalAlign={"middle"}
                        width={cellWidth}
                        x={-frameTextOffsetX}
                        y={row.patternIndex * cellHeight}
                        onClick={(event) => handleOnRowClick(event, row)}
                        onContextMenu={onContextMenu}
                    />
                    <Text
                        key={`row-right-number-${row.patternIndex}`}
                        align={"left"}
                        fill={FrameTextColor}
                        height={cellHeight}
                        text={(row.patternIndex + 1).toString()}
                        verticalAlign={"middle"}
                        width={cellWidth}
                        x={columns * cellWidth + frameMarginX}
                        y={row.patternIndex * cellHeight}
                        onClick={(event) => handleOnRowClick(event, row)}
                        onContextMenu={onContextMenu}
                    />
                </Fragment>
            ))}
            <Rect
                key={"selected-column-frame"}
                cornerRadius={20}
                height={selectedColumnHeight}
                width={selectedColumnWidth}
                stroke={FrameSelectedColor}
                strokeWidth={2}
                x={selectedColumnPositionX}
                y={selectedColumnPositionY}
                visible={selectedColumn >= 0}
                onContextMenu={onContextMenu}
            />
            <Rect
                key={"selected-row-frame"}
                cornerRadius={20}
                height={selectedRowHeight}
                width={selectedRowWidth}
                stroke={FrameSelectedColor}
                strokeWidth={2}
                x={selectedRowPositionX}
                y={selectedRowPositionY}
                visible={selectedRow >= 0}
                onContextMenu={onContextMenu}
            />
        </Group>
    );
};

const getCellPosition = (
    grid: BeadingGridState,
    cellHeight: number,
    cellWidth: number,
    rowIndex: number,
    columnIndex: number
) => {
    const cellOffsetX = cellWidth / 2;
    const cellOffsetY = cellHeight / 2;

    const getBrickOffsetX = (index: number, height: number, drop: number, fringe: number) => {
        const dropOffsetNormal = Math.floor(index / drop) % 2;
        const fringeOffsetNormal = index > height - fringe ? 0 : 1;
        return cellOffsetX * dropOffsetNormal * fringeOffsetNormal;
    };
    const getPeyoteOffsetY = (index: number) => {
        const columnOffsetNormal = index % 2;
        return cellOffsetY * columnOffsetNormal;
    };

    const x = grid.options.type === "brick"
        ? cellWidth * columnIndex + getBrickOffsetX(
            rowIndex,
            grid.rows.length,
            grid.options.drop,
            grid.options.fringe
        )
        : cellWidth * columnIndex;
    const y = grid.options.type === "brick"
        ? cellHeight * rowIndex
        : grid.options.type === "peyote"
            ? cellHeight * rowIndex + getPeyoteOffsetY(columnIndex)
            : cellHeight * rowIndex;

    return { x, y };
};

const BeadingGrid: FC<{
    position?: { x: number; y: number };
    grid: BeadingGridState;
    metadata: BeadingGridMetadata;
    beadSize: BeadSize;
    onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
    position,
    grid,
    metadata,
    beadSize,
    onBeadingClick,
    onBeadingPointerDown,
    onBeadingPointerUp,
    onBeadingPointerEnter,
}) => {
    const cellHeight = grid.options.type === "brick"
        ? beadSize.width * CellPixelRatio
        : beadSize.height * CellPixelRatio;
    const cellWidth = grid.options.type === "brick"
        ? beadSize.height * CellPixelRatio
        : beadSize.width * CellPixelRatio;

    const handleOnBeadingGridClick = useCallback((event: BeadingPointerEvent) => {
        onBeadingClick?.(grid, event);
    }, [grid, onBeadingClick]);

    const handleOnBeadingGridDown = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerDown?.(grid, event);
    }, [grid, onBeadingPointerDown]);

    const handleOnBeadingGridUp = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerUp?.(grid, event);
    }, [grid, onBeadingPointerUp]);

    const handleOnBeadingGridEnter = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerEnter?.(grid, event);
    }, [grid, onBeadingPointerEnter]);

    return (
        <Group x={position?.x ?? 0} y={position?.y ?? 0}>
            {grid.rows.map((row, rowIndex) =>
                row.cells.map((cell, columnIndex) => (
                    <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        color={cell}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        height={cellHeight}
                        width={cellWidth}
                        position={getCellPosition(grid, cellHeight, cellWidth, rowIndex, columnIndex)}
                        onClick={handleOnBeadingGridClick}
                        onPointerDown={handleOnBeadingGridDown}
                        onPointerUp={handleOnBeadingGridUp}
                        onPointerEnter={handleOnBeadingGridEnter}
                    />
                ))
            )}
            {metadata.divider.isVisible && (
                <Line
                    points={metadata.divider.points}
                    stroke={DividerStrokeColor}
                    strokeWidth={1}
                />
            )}
            <Text text={grid.name} fill={DividerStrokeColor} />
        </Group>
    );
};

const GridCell: FC<{
    color?: string;
    columnIndex: number;
    rowIndex: number;
    height: number;
    width: number;
    position: { x: number; y: number };
    onClick?: (event: BeadingPointerEvent) => void;
    onPointerDown?: (event: BeadingPointerEvent) => void;
    onPointerUp?: (event: BeadingPointerEvent) => void;
    onPointerOver?: (event: BeadingPointerEvent) => void;
    onPointerEnter?: (event: BeadingPointerEvent) => void;
}> = ({
    color,
    columnIndex,
    rowIndex,
    height,
    width,
    position,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerEnter,
}) => {
    const handleOnClick = useCallback(() => {
        onClick?.({ row: rowIndex, column: columnIndex, ...position });
    }, [rowIndex, columnIndex, position, onClick]);

    const handleOnPointerDown = useCallback(() => {
        onPointerDown?.({ row: rowIndex, column: columnIndex, ...position });
    }, [rowIndex, columnIndex, position, onPointerDown]);

    const handleOnPointerUp = useCallback(() => {
        onPointerUp?.({ row: rowIndex, column: columnIndex, ...position });
    }, [rowIndex, columnIndex, position, onPointerUp]);

    const handleOnPointerOver = useCallback(() => {
        onPointerOver?.({ row: rowIndex, column: columnIndex, ...position });
    }, [rowIndex, columnIndex, position, onPointerOver]);

    const handleOnPointerEnter = useCallback(() => {
        onPointerEnter?.({ row: rowIndex, column: columnIndex, ...position });
    }, [rowIndex, columnIndex, position, onPointerEnter]);

    return (
        <Fragment>
            <Rect
                cornerRadius={2}
                fill={color}
                height={height}
                stroke={isNullOrEmpty(color) ? CellBlankColor : CellStrokeColor}
                strokeWidth={1}
                width={width}
                x={position.x}
                y={position.y}
                onClick={handleOnClick}
                onTap={handleOnClick}
                onPointerDown={handleOnPointerDown}
                onPointerUp={handleOnPointerUp}
                onPointerOver={handleOnPointerOver}
                onPointerEnter={handleOnPointerEnter}
            />
            {isNullOrEmpty(color) && (
                <Circle
                    fill={CellDotColor}
                    height={2}
                    width={2}
                    x={position.x + width / 2}
                    y={position.y + height / 2}
                    onClick={handleOnClick}
                />
            )}
        </Fragment>
    );
};

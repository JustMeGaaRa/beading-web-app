import {
    Box,
    Button,
    Menu,
    MenuButton,
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
    PropsWithChildren,
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
    BrickGridProperties,
    getPatternMetadata,
    PatternOptions,
    FrameTextColor,
    getPatternSize,
} from "../components";
import {
    CellBlankColor,
    CellDotColor,
    CellPixelRatio,
    CellStrokeColor,
    DividerStrokeColor,
    usePattern,
    downloadUri,
    isNullOrEmpty,
    toJsonUri
} from "../components";

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { name, grids, options, setPatternCover, setGridCellColor, getPattern } = usePattern();
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
            const imageUri = stageRef.current?.toDataURL() ?? "";
            setPatternCover(imageUri);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [stageRef.current, setPatternCover]);

    const handleOnBeadingClick = useCallback((source: BeadingGridState, event: BeadingPointerEvent) => {
        const { row, column } = event;

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

    const handleOnBeadingPointerDown = useCallback(() => {
        setIsPointerDown(true);
    }, [setIsPointerDown]);

    const handleOnBeadingPointerUp = useCallback(() => {
        setIsPointerDown(false);
    }, [setIsPointerDown]);

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

    const handleOnContextMenu = useCallback((event: Konva.KonvaEventObject<PointerEvent>) => {
        event.evt.preventDefault();
        onOpen();
    }, [onOpen]);

    const metadata = useMemo(() => getPatternMetadata(getPattern(), options), [getPattern, options]);

    const handleOnWheel = useCallback((event: Konva.KonvaEventObject<WheelEvent>) => {
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

    const handleOnTouchMove = useCallback((event: Konva.KonvaEventObject<TouchEvent>) => {
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

    const handleOnTouchEnd = useCallback(() => {
        lastDist.current = 0;
    }, []);

    const handleOnSaveImageClick = useCallback(() => {
        const imageUri = stageRef.current?.toDataURL() ?? "";
        downloadUri(imageUri, `${name}.png`);
    }, [name, stageRef.current]);

    const handleOnSavePatternClick = useCallback(() => {
        const pattern = getPattern();
        const patternUri = toJsonUri(pattern);
        downloadUri(patternUri, `${name}.json`);
    }, [name, grids, options]);

    return (
        <Box ref={containerRef} height={"100%"} width={"100%"}>
            <Stage
                ref={stageRef}
                draggable={selectedTool === "cursor"}
                height={stageSize.height}
                width={stageSize.width}
                onContextMenu={handleOnContextMenu}
                onTouchMove={handleOnTouchMove}
                onTouchEnd={handleOnTouchEnd}
                onWheel={handleOnWheel}
            >
                <Layer>
                    <PatternFrame
                        {...getPatternSize(getPattern(), options)}
                        options={options}
                    />
                </Layer>
                {grids.map((grid) => {
                    switch (grid.options.type) {
                        case "square":
                            return (
                                <Layer
                                    key={grid.name}
                                    x={metadata.grids[grid.name].position.x}
                                    y={metadata.grids[grid.name].position.y}
                                >
                                    <SquareGrid
                                        grid={grid}
                                        beadSize={options.layout.beadSize}
                                        onBeadingClick={handleOnBeadingClick}
                                        onBeadingPointerDown={handleOnBeadingPointerDown}
                                        onBeadingPointerUp={handleOnBeadingPointerUp}
                                        onBeadingPointerEnter={handleOnBeadingPointerEnter}
                                    />
                                    {metadata.grids[grid.name].divider.isVisible && (
                                        <Line
                                            points={metadata.grids[grid.name].divider.points}
                                            stroke={DividerStrokeColor}
                                            strokeWidth={1}
                                        />
                                    )}
                                </Layer>
                            );
                        case "peyote":
                            return (
                                <Layer
                                    key={grid.name}
                                    x={metadata.grids[grid.name].position.x}
                                    y={metadata.grids[grid.name].position.y}
                                >
                                    <PeyoteGrid
                                        grid={grid}
                                        beadSize={options.layout.beadSize}
                                        onBeadingClick={handleOnBeadingClick}
                                        onBeadingPointerDown={handleOnBeadingPointerDown}
                                        onBeadingPointerUp={handleOnBeadingPointerUp}
                                        onBeadingPointerEnter={handleOnBeadingPointerEnter}
                                    />
                                    {metadata.grids[grid.name].divider.isVisible && (
                                        <Line
                                            points={metadata.grids[grid.name].divider.points}
                                            stroke={DividerStrokeColor}
                                            strokeWidth={1}
                                        />
                                    )}
                                </Layer>
                            );
                        case "brick":
                            return (
                                <Layer
                                    key={grid.name}
                                    x={metadata.grids[grid.name].position.x}
                                    y={metadata.grids[grid.name].position.y}
                                >
                                    <BrickGrid
                                        grid={grid}
                                        beadSize={options.layout.beadSize}
                                        options={grid.options}
                                        onBeadingClick={handleOnBeadingClick}
                                        onBeadingPointerDown={handleOnBeadingPointerDown}
                                        onBeadingPointerUp={handleOnBeadingPointerUp}
                                        onBeadingPointerEnter={handleOnBeadingPointerEnter}
                                    />
                                    {metadata.grids[grid.name].divider.isVisible && (
                                        <Line
                                            points={metadata.grids[grid.name].divider.points}
                                            stroke={DividerStrokeColor}
                                            strokeWidth={1}
                                        />
                                    )}
                                </Layer>
                            );
                    }
                })}
            </Stage>
            <Menu isOpen={isOpen} onClose={onClose} closeOnBlur closeOnSelect>
                <MenuList>
                    <MenuItem>Select All</MenuItem>
                    <MenuItem>Clear</MenuItem>
                </MenuList>
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

const PatternFrame: FC<{
    width: number;
    height: number;
    options: PatternOptions;
}> = ({
    width: columns,
    height: rows,
    options
}) => {
    const cellWidth = options.layout.beadSize.width * CellPixelRatio;
    const cellHeight = options.layout.beadSize.height * CellPixelRatio;
    
    return (
        <Group>
            {Array.from({ length: columns }, (_, index) => (
                <>
                    <Text
                        key={`top-column-${index}`}
                        x={index * cellWidth}
                        y={-cellWidth * 1.5}
                        text={(index + 1).toString()}
                        align={"center"}
                        verticalAlign={"middle"}
                        height={cellHeight}
                        width={cellWidth}
                        fill={FrameTextColor}
                    />
                    <Text
                        key={`bottom-column-${index}`}
                        x={index * cellWidth}
                        y={rows * cellHeight}
                        text={(index + 1).toString()}
                        align={"center"}
                        verticalAlign={"middle"}
                        height={cellHeight}
                        width={cellWidth}
                        fill={FrameTextColor}
                    />
                </>
            ))}
            {Array.from({ length: rows }, (_, index) => (
                <>
                    <Text
                        key={`left-row-${index}`}
                        x={-cellWidth * 1.5}
                        y={index * cellHeight}
                        align={"right"}
                        verticalAlign={"middle"}
                        height={cellHeight}
                        width={cellWidth}
                        text={(index + 1).toString()}
                        fill={FrameTextColor}
                    />
                    <Text
                        key={`right-row-${index}`}
                        x={columns * cellWidth}
                        y={index * cellHeight}
                        align={"right"}
                        verticalAlign={"middle"}
                        height={cellHeight}
                        width={cellWidth}
                        text={(index + 1).toString()}
                        fill={FrameTextColor}
                    />
                </>
            ))}
        </Group>
    );
};

const SquareGrid: FC<{
    grid: BeadingGridState;
    beadSize: BeadSize;
    onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerOver?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
    grid,
    beadSize,
    onBeadingClick,
    onBeadingPointerDown,
    onBeadingPointerUp,
    onBeadingPointerOver,
    onBeadingPointerEnter,
}) => {
    const cellHeight = beadSize.height * CellPixelRatio;
    const cellWidth = beadSize.width * CellPixelRatio;

    const handleOnBeadingGridClick = useCallback((event: BeadingPointerEvent) => {
        onBeadingClick?.(grid, event);
    }, [grid, onBeadingClick]);

    const handleOnBeadingGridDown = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerDown?.(grid, event);
    }, [grid, onBeadingPointerDown]);

    const handleOnBeadingGridUp = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerUp?.(grid, event);
    }, [grid, onBeadingPointerUp]);

    const handleOnBeadingGridOver = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerOver?.(grid, event);
    }, [grid, onBeadingPointerOver]);

    const handleOnBeadingGridEnter = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerEnter?.(grid, event);
    }, [grid, onBeadingPointerEnter]);

    return (
        <Group>
            {grid.rows.map((row, rowIndex) =>
                row.cells.map((cell, columnIndex) => (
                    <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        fill={cell}
                        row={rowIndex}
                        column={columnIndex}
                        height={cellHeight}
                        width={cellWidth}
                        x={cellWidth * columnIndex}
                        y={cellHeight * rowIndex}
                        onClick={handleOnBeadingGridClick}
                        onPointerDown={handleOnBeadingGridDown}
                        onPointerUp={handleOnBeadingGridUp}
                        onPointerOver={handleOnBeadingGridOver}
                        onPointerEnter={handleOnBeadingGridEnter}
                    />
                ))
            )}
            <Text text={grid.name} fill={DividerStrokeColor} />
        </Group>
    );
};

const PeyoteGrid: FC<{
    grid: BeadingGridState;
    beadSize: BeadSize;
    onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerOver?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
    grid,
    beadSize,
    onBeadingClick,
    onBeadingPointerDown,
    onBeadingPointerUp,
    onBeadingPointerOver,
    onBeadingPointerEnter,
}) => {
    const cellHeight = beadSize.height * CellPixelRatio;
    const cellWidth = beadSize.width * CellPixelRatio;

    const handleOnBeadingGridClick = useCallback((event: BeadingPointerEvent) => {
        onBeadingClick?.(grid, event);
    }, [grid, onBeadingClick]);

    const handleOnBeadingGridDown = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerDown?.(grid, event);
    }, [grid, onBeadingPointerDown]);

    const handleOnBeadingGridUp = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerUp?.(grid, event);
    }, [grid, onBeadingPointerUp]);

    const handleOnBeadingGridOver = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerOver?.(grid, event);
    }, [grid, onBeadingPointerOver]);

    const handleOnBeadingGridEnter = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerEnter?.(grid, event);
    }, [grid, onBeadingPointerEnter]);

    return (
        <Group>
            {grid.rows.map((row, rowIndex) =>
                row.cells.map((cell, columnIndex) => (
                    <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        fill={cell}
                        row={rowIndex}
                        column={columnIndex}
                        height={cellHeight}
                        width={cellWidth}
                        x={cellWidth * columnIndex}
                        y={cellHeight * rowIndex + (cellHeight / 2) * (columnIndex % 2)}
                        onClick={handleOnBeadingGridClick}
                        onPointerDown={handleOnBeadingGridDown}
                        onPointerUp={handleOnBeadingGridUp}
                        onPointerOver={handleOnBeadingGridOver}
                        onPointerEnter={handleOnBeadingGridEnter}
                    />
                ))
            )}
            <Text text={grid.name} fill={DividerStrokeColor} />
        </Group>
    );
};

const BrickGrid: FC<{
    position?: { x: number; y: number };
    grid: BeadingGridState;
    beadSize: BeadSize;
    options: BrickGridProperties;
    onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerOver?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
    position,
    grid,
    beadSize,
    options,
    onBeadingClick,
    onBeadingPointerDown,
    onBeadingPointerUp,
    onBeadingPointerOver,
    onBeadingPointerEnter,
}) => {
    const cellHeight = beadSize.width * CellPixelRatio;
    const cellWidth = beadSize.height * CellPixelRatio;

    const handleOnBeadingGridClick = useCallback((event: BeadingPointerEvent) => {
        onBeadingClick?.(grid, event);
    }, [grid, onBeadingClick]);

    const handleOnBeadingGridDown = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerDown?.(grid, event);
    }, [grid, onBeadingPointerDown]);

    const handleOnBeadingGridUp = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerUp?.(grid, event);
    }, [grid, onBeadingPointerUp]);

    const handleOnBeadingGridOver = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerOver?.(grid, event);
    }, [grid, onBeadingPointerOver]);

    const handleOnBeadingGridEnter = useCallback((event: BeadingPointerEvent) => {
        onBeadingPointerEnter?.(grid, event);
    }, [grid, onBeadingPointerEnter]);

    return (
        <Group>
            {grid.rows.map((row, rowIndex) =>
                row.cells.map((cell, columnIndex) => (
                    <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        fill={cell}
                        row={rowIndex}
                        column={columnIndex}
                        height={cellHeight}
                        width={cellWidth}
                        x={
                            cellWidth * columnIndex +
                            (cellWidth / 2) * (Math.floor(rowIndex / options.drop) % 2 *
                            (rowIndex > grid.rows.length - options.fringe ? 0 : 1))
                        }
                        y={cellHeight * rowIndex}
                        onClick={handleOnBeadingGridClick}
                        onPointerDown={handleOnBeadingGridDown}
                        onPointerUp={handleOnBeadingGridUp}
                        onPointerOver={handleOnBeadingGridOver}
                        onPointerEnter={handleOnBeadingGridEnter}
                    />
                ))
            )}
            <Text text={grid.name} fill={DividerStrokeColor} />
        </Group>
    );
};

const GridCell: FC<{
    fill?: string;
    height: number;
    width: number;
    row: number;
    column: number;
    x: number;
    y: number;
    onClick?: (event: BeadingPointerEvent) => void;
    onPointerDown?: (event: BeadingPointerEvent) => void;
    onPointerUp?: (event: BeadingPointerEvent) => void;
    onPointerOver?: (event: BeadingPointerEvent) => void;
    onPointerEnter?: (event: BeadingPointerEvent) => void;
}> = ({
    fill,
    height,
    width,
    row,
    column,
    x,
    y,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerEnter,
}) => {
    const handleOnClick = useCallback(() => {
        onClick?.({ row, column, x, y });
    }, [row, column, x, y, onClick]);

    const handleOnPointerDown = useCallback(() => {
        onPointerDown?.({ row, column, x, y });
    }, [row, column, x, y, onPointerDown]);

    const handleOnPointerUp = useCallback(() => {
        onPointerUp?.({ row, column, x, y });
    }, [row, column, x, y, onPointerUp]);

    const handleOnPointerOver = useCallback(() => {
        onPointerOver?.({ row, column, x, y });
    }, [row, column, x, y, onPointerOver]);

    const handleOnPointerEnter = useCallback(() => {
        onPointerEnter?.({ row, column, x, y });
    }, [row, column, x, y, onPointerEnter]);

    return (
        <>
            <Rect
                cornerRadius={2}
                fill={fill}
                height={height}
                stroke={isNullOrEmpty(fill) ? CellBlankColor : CellStrokeColor}
                strokeWidth={1}
                width={width}
                x={x}
                y={y}
                onClick={handleOnClick}
                onTap={handleOnClick}
                onPointerDown={handleOnPointerDown}
                onPointerUp={handleOnPointerUp}
                onPointerOver={handleOnPointerOver}
                onPointerEnter={handleOnPointerEnter}
            />
            {isNullOrEmpty(fill) && (
                <Circle
                    fill={CellDotColor}
                    height={2}
                    width={2}
                    x={x + width / 2}
                    y={y + height / 2}
                    onClick={handleOnClick}
                />
            )}
        </>
    );
};

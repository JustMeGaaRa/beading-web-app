import { Box, Menu, MenuList, MenuItem, useDisclosure } from "@chakra-ui/react";
import {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";
import Konva from "konva";
import {
  usePattern,
  useColorPalette,
  useTools,
  BeadSize,
  BeadingGridState,
  BrickGridProperties,
  BeadingGridCellState,
} from "../components";
import { isNullOrEmpty, setGridCell } from "../utils";
import {
  CellBlankColor,
  CellDotColor,
  CellPixelRatio,
  CellStrokeColor,
  DividerStrokeColor,
} from "../constants";

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
  const { grids, options: patternOptions, setGrids } = usePattern();
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

  const setCellColor = useCallback(
    (gridName: string, cell: BeadingGridCellState) => {
      setGrids((grids) =>
        grids.map((grid) =>
          grid.name === gridName ? setGridCell(grid, cell) : grid
        )
      );
    },
    [setGrids]
  );

  const handleOnBeadingClick = useCallback(
    (source: BeadingGridState, event: BeadingPointerEvent) => {
      const { row, column } = event;

      if (selectedTool === "pencil") {
        setCellColor(source.name, { row, column, color: selectedColor });
      }
      if (selectedTool === "eraser") {
        setCellColor(source.name, { row, column, color: CellBlankColor });
      }
      if (selectedTool === "picker") {
        setSelectedColor(source.rows[row].cells[column]);
      }
    },
    [selectedTool, selectedColor, setGrids]
  );

  const handleOnBeadingPointerDown = useCallback(
    (source: BeadingGridState, event: BeadingPointerEvent) => {
      setIsPointerDown(true);
    },
    [setIsPointerDown]
  );

  const handleOnBeadingPointerUp = useCallback(
    (source: BeadingGridState, event: BeadingPointerEvent) => {
      setIsPointerDown(false);
    },
    [setIsPointerDown]
  );

  const handleOnBeadingPointerEnter = useCallback(
    (source: BeadingGridState, event: BeadingPointerEvent) => {
      if (isPointerDown) {
        if (selectedTool === "pencil") {
          setCellColor(source.name, {
            row: event.row,
            column: event.column,
            color: selectedColor,
          });
        }
        if (selectedTool === "eraser") {
          setCellColor(source.name, {
            row: event.row,
            column: event.column,
            color: CellBlankColor,
          });
        }
      }
    },
    [isPointerDown, setCellColor]
  );

  const handleOnContextMenu = useCallback(
    (event: Konva.KonvaEventObject<PointerEvent>) => {
      onOpen();
      event.evt.preventDefault();
    },
    [onOpen]
  );

  const { metadata } = useMemo(() => {
    let offsetX = 0;
    let offsetY = 0;
    const initialMetadata = {} as Record<
      string,
      {
        position: { x: number; y: number };
        size: { height: number; width: number };
        divider: { isVisible: boolean; points: Array<number> };
      }
    >;
    const isHorizontal = patternOptions.layout.orientation === "horizontal";

    const metadata = grids.reduce((metadata, grid, index) => {
      const gridHeight = isHorizontal
        ? patternOptions.layout.height *
          patternOptions.layout.beadSize.height *
          CellPixelRatio
        : grid.options.height *
          patternOptions.layout.beadSize.height *
          CellPixelRatio;
      const gridWidth = isHorizontal
        ? grid.options.width *
          patternOptions.layout.beadSize.width *
          CellPixelRatio
        : patternOptions.layout.width *
          patternOptions.layout.beadSize.width *
          CellPixelRatio;
      const dividerPoints = isHorizontal
        ? [gridWidth, 0, gridWidth, gridHeight]
        : [0, gridHeight, gridWidth, gridHeight];

      const gridMetadata = {
        ...metadata,
        [grid.name]: {
          position: {
            x: offsetX,
            y: offsetY,
          },
          size: {
            height: gridHeight,
            width: gridWidth,
          },
          divider: {
            isVisible: index < grids.length - 1,
            points: dividerPoints,
          },
        },
      };

      offsetX = isHorizontal ? offsetX + gridWidth : 0;
      offsetY = isHorizontal ? 0 : offsetY + gridHeight;

      return gridMetadata;
    }, initialMetadata);

    return {
      metadata,
    };
  }, [grids, patternOptions]);

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

    if (event.evt.touches.length === 2) {
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
    }
  }, [stageRef]);

  const handleOnTouchEnd = useCallback(() => {
    lastDist.current = 0;
  }, []);

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
        {grids.map((grid) => {
          switch (grid.options.type) {
            case "square":
              return (
                <Layer
                  key={grid.name}
                  x={metadata[grid.name].position.x}
                  y={metadata[grid.name].position.y}
                >
                  <SquareGrid
                    grid={grid}
                    beadSize={patternOptions.layout.beadSize}
                    onBeadingClick={handleOnBeadingClick}
                    onBeadingPointerDown={handleOnBeadingPointerDown}
                    onBeadingPointerUp={handleOnBeadingPointerUp}
                    onBeadingPointerEnter={handleOnBeadingPointerEnter}
                  />
                  <Text text={grid.name} fill={DividerStrokeColor} />
                  {metadata[grid.name].divider.isVisible && (
                    <Line
                      points={metadata[grid.name].divider.points}
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
                  x={metadata[grid.name].position.x}
                  y={metadata[grid.name].position.y}
                >
                  <PeyoteGrid
                    grid={grid}
                    beadSize={patternOptions.layout.beadSize}
                    onBeadingClick={handleOnBeadingClick}
                    onBeadingPointerDown={handleOnBeadingPointerDown}
                    onBeadingPointerUp={handleOnBeadingPointerUp}
                    onBeadingPointerEnter={handleOnBeadingPointerEnter}
                  />
                  <Text text={grid.name} fill={DividerStrokeColor} />
                  {metadata[grid.name].divider.isVisible && (
                    <Line
                      points={metadata[grid.name].divider.points}
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
                  x={metadata[grid.name].position.x}
                  y={metadata[grid.name].position.y}
                >
                  <BrickGrid
                    grid={grid}
                    beadSize={patternOptions.layout.beadSize}
                    options={grid.options}
                    onBeadingClick={handleOnBeadingClick}
                    onBeadingPointerDown={handleOnBeadingPointerDown}
                    onBeadingPointerUp={handleOnBeadingPointerUp}
                    onBeadingPointerEnter={handleOnBeadingPointerEnter}
                  />
                  <Text text={grid.name} fill={DividerStrokeColor} />
                  {metadata[grid.name].divider.isVisible && (
                    <Line
                      points={metadata[grid.name].divider.points}
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
    </Box>
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
    <>
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
    </>
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
    <>
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
    </>
  );
};

const BrickGrid: FC<{
  grid: BeadingGridState;
  beadSize: BeadSize;
  options: BrickGridProperties;
  onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
  onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
  onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
  onBeadingPointerOver?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
  onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
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
    <>
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
    </>
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

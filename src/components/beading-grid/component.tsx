import { KonvaEventObject } from "konva/lib/Node";
import { FC, Fragment, PropsWithChildren, useCallback } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";
import {
    CellBlankColor,
    CellDotColor,
    CellStrokeColor,
    DividerStrokeColor,
    FrameSelectedBorderColor,
    FrameSelectedFillColor
} from "./constants";
import { GridOptionsContext } from "./context";
import { useGridOptions } from "./hooks";
import {
    BeadingGridCellState,
    BeadingGridMetadata,
    BeadingGridState,
    BeadingPointerEvent,
    BeadSize,
    GridCellPosition
} from "./types";
import {
    getGridCellRenderPosition,
    isNullOrEmpty
} from "./utils";

export const GridOptionsProvider: FC<PropsWithChildren<{
    cellHeight: number;
    cellWidth: number;
    pointPixelRatio: number;
}>> = ({
    children,
    cellHeight,
    cellWidth,
    pointPixelRatio
}) => {
    return (
        <GridOptionsContext.Provider value={{ cellHeight, cellWidth, pointPixelRatio }}>
            {children}
        </GridOptionsContext.Provider>
    );
};

export const BeadingGrid: FC<{
    offset?: GridCellPosition;
    grid: BeadingGridState;
    beadSize: BeadSize;
    onBeadingClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onBeadingPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}> = ({
    offset,
    grid,
    beadSize,
    onBeadingClick,
    onBeadingPointerDown,
    onBeadingPointerUp,
    onBeadingPointerEnter,
}) => {
    const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

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

    const positionX = (offset?.columnIndex ?? 0) * cellWidth * pointPixelRatio;
    const positionY = (offset?.rowIndex ?? 0) * cellHeight * pointPixelRatio;
    const fringeColumnIndex = 0;
    const fringeRowIndex = grid.options.type === "brick"
        ? grid.rows.length - grid.options.fringe
        : grid.rows.length;

    return (
        <Group x={positionX} y={positionY}>
            {grid.rows.map((row, rowIndex) =>
                row.cells.map((cell, columnIndex) => (
                    <GridCell
                        key={`${rowIndex}-${columnIndex}`}
                        color={cell}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        height={cellHeight * pointPixelRatio}
                        width={cellWidth * pointPixelRatio}
                        position={getGridCellRenderPosition(grid, beadSize, rowIndex, columnIndex)}
                        onClick={handleOnBeadingGridClick}
                        onPointerDown={handleOnBeadingGridDown}
                        onPointerUp={handleOnBeadingGridUp}
                        onPointerEnter={handleOnBeadingGridEnter}
                    />
                ))
            )}
            {grid.options.type === "brick" && (
                <GridDivider
                    length={grid.rows[0].cells.length}
                    offset={{ columnIndex: fringeColumnIndex, rowIndex: fringeRowIndex }}
                    orientation={"horizontal"}
                    strokeColor={DividerStrokeColor}
                    strokeWidth={1}
                />
            )}
        </Group>
    );
};

export const GridDivider: FC<{
    length: number;
    offset: GridCellPosition;
    orientation: "horizontal" | "vertical";
    strokeColor?: string;
    strokeWidth?: number;
}> = ({
    length,
    offset,
    orientation,
    strokeColor,
    strokeWidth = 1,
}) => {
    const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

    const positionX1 = offset.columnIndex * cellWidth * pointPixelRatio;
    const positionY1 = offset.rowIndex * cellHeight * pointPixelRatio;
    const positionX2 = orientation === "horizontal"
        ? (offset.columnIndex + length) * cellWidth * pointPixelRatio
        : offset.columnIndex * cellWidth * pointPixelRatio;
    const positionY2 = orientation === "horizontal"
        ? offset.rowIndex * cellHeight * pointPixelRatio
        : (offset.rowIndex + length) * cellHeight * pointPixelRatio;
    
    return (
        <Line
            points={[positionX1, positionY1, positionX2, positionY2]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
        />
    );
};

export const GridText: FC<{
    color?: string;
    offset: GridCellPosition;
    padding?: number;
    text: string;
}> = ({
    color,
    offset,
    padding = 0,
    text,
}) => {
    const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

    return (
        <Text
            height={cellHeight * pointPixelRatio}
            align={"left"}
            verticalAlign={"middle"}
            padding={padding}
            text={text}
            fill={color}
            x={offset.columnIndex * cellWidth * pointPixelRatio}
            y={offset.rowIndex * cellHeight * pointPixelRatio}
        />
    );
};

export const HighlightedArea: FC<{
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    offset: GridCellPosition;
    height: number;
    width: number;
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    backgroundColor,
    borderColor,
    borderWidth,
    offset,
    height,
    width,
    onClick,
}) => {
    const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

    const areaX = offset.columnIndex * cellWidth * pointPixelRatio;
    const areaY = offset.rowIndex * cellHeight * pointPixelRatio;
    const areaHeight = height * cellHeight * pointPixelRatio;
    const areaWidth = width * cellWidth * pointPixelRatio;

    return (
        <Rect
            fill={backgroundColor}
            listening={!!backgroundColor}
            opacity={0.3}
            stroke={borderColor}
            strokeWidth={borderWidth}
            height={areaHeight}
            width={areaWidth}
            x={areaX}
            y={areaY}
            onClick={onClick}
        />
    );
};

export const GridCell: FC<{
    color: string;
    columnIndex: number;
    rowIndex: number;
    height: number;
    width: number;
    position: { x: number; y: number };
    isSelected?: boolean;
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
    isSelected,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerEnter,
}) => {
    const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

    const handleOnClick = useCallback(() => {
        onClick?.({ cell: { rowIndex, columnIndex, color }});
    }, [rowIndex, columnIndex, position, onClick]);

    const handleOnPointerDown = useCallback(() => {
        onPointerDown?.({ cell: { rowIndex, columnIndex, color }});
    }, [rowIndex, columnIndex, position, onPointerDown]);

    const handleOnPointerUp = useCallback(() => {
        onPointerUp?.({ cell: { rowIndex, columnIndex, color }});
    }, [rowIndex, columnIndex, position, onPointerUp]);

    const handleOnPointerOver = useCallback(() => {
        onPointerOver?.({ cell: { rowIndex, columnIndex, color }});
    }, [rowIndex, columnIndex, position, onPointerOver]);

    const handleOnPointerEnter = useCallback(() => {
        onPointerEnter?.({ cell: { rowIndex, columnIndex, color }});
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
            {isSelected && (
                <Rect
                    cornerRadius={2}
                    fill={FrameSelectedFillColor}
                    height={height}
                    opacity={0.3}
                    stroke={FrameSelectedBorderColor}
                    strokeWidth={2}
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
            )}
            {isNullOrEmpty(color) && (
                <Circle
                    fill={CellDotColor}
                    height={4}
                    width={4}
                    x={position.x + width / 2}
                    y={position.y + height / 2}
                    onClick={handleOnClick}
                />
            )}
        </Fragment>
    );
};

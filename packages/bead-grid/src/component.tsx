import { KonvaEventObject } from "konva/lib/Node";
import { FC, Fragment, PropsWithChildren, useCallback } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";
import {
    CELL_BLANK_COLOR,
    CELL_DOT_COLOR,
    CELL_BORDER_COLOR,
    DIVIDER_STROKE_COLOR,
    FRAME_SELECTED_BORDER_COLOR,
    FRAME_SELECTED_FILL_COLOR
} from "./constants";
import { GridOptionsContext } from "./context";
import { useGridOptions } from "./hooks";
import {
    BeadingGridCell,
    BeadingGridState,
    BeadingGridOffset
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

export type BeadingPointerEvent = {
    cell: BeadingGridCell;
};

export const BeadingGrid: FC<PropsWithChildren<{
    offset?: BeadingGridOffset;
    grid: BeadingGridState;
    onCellClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}>> = ({
    children,
    offset,
    grid,
    onCellClick,
    onCellPointerDown,
    onCellPointerUp,
    onCellPointerEnter,
}) => {
        const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

        const handleOnCellClick = useCallback((event: BeadingPointerEvent) => {
            onCellClick?.(grid, event);
        }, [grid, onCellClick]);

        const handleOnCellPointerDown = useCallback((event: BeadingPointerEvent) => {
            onCellPointerDown?.(grid, event);
        }, [grid, onCellPointerDown]);

        const handleOnCellPointerUp = useCallback((event: BeadingPointerEvent) => {
            onCellPointerUp?.(grid, event);
        }, [grid, onCellPointerUp]);

        const handleOnCellPointerEnter = useCallback((event: BeadingPointerEvent) => {
            onCellPointerEnter?.(grid, event);
        }, [grid, onCellPointerEnter]);

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
                            position={getGridCellRenderPosition(grid, { height: cellHeight, width: cellWidth }, rowIndex, columnIndex)}
                            onClick={handleOnCellClick}
                            onPointerDown={handleOnCellPointerDown}
                            onPointerUp={handleOnCellPointerUp}
                            onPointerEnter={handleOnCellPointerEnter}
                        />
                    ))
                )}
                {grid.options.type === "brick" && (
                    <GridDivider
                        length={grid.rows[0]?.cells.length ?? 0}
                        offset={{ columnIndex: fringeColumnIndex, rowIndex: fringeRowIndex }}
                        orientation={"horizontal"}
                        strokeColor={DIVIDER_STROKE_COLOR}
                        strokeWidth={1}
                    />
                )}
                {children}
            </Group>
        );
    };

export const GridDivider: FC<{
    length: number;
    offset: BeadingGridOffset;
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
    offset: BeadingGridOffset;
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
    offset: BeadingGridOffset;
    height: number;
    width: number;
    grid: BeadingGridState
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    backgroundColor,
    borderColor,
    borderWidth,
    offset,
    height,
    width,
    grid,
    onClick,
}) => {
        const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

        const topBoundary = 0;
        const leftBoundary = 0;
        const rightBoundary = grid.rows.length - offset.rowIndex;
        const bottomBoundary = (grid.rows[0]?.cells.length ?? 0) - offset.columnIndex;

        const truncatedColumnIndex = Math.min(Math.max(topBoundary, offset.columnIndex), (grid.rows[0]?.cells.length ?? 0));
        const truncatedRowIndex = Math.min(Math.max(leftBoundary, offset.rowIndex), grid.rows.length);
        const truncatedHeight = Math.min(offset.rowIndex < 0 ? height + offset.rowIndex : height, rightBoundary);
        const truncatedWidth = Math.min(offset.columnIndex < 0 ? width + offset.columnIndex : width, bottomBoundary);

        const areaX = truncatedColumnIndex * cellWidth * pointPixelRatio;
        const areaY = truncatedRowIndex * cellHeight * pointPixelRatio;
        const areaHeight = truncatedHeight * cellHeight * pointPixelRatio;
        const areaWidth = truncatedWidth * cellWidth * pointPixelRatio;

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
                onTap={onClick}
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
        const handleOnClick = useCallback(() => {
            onClick?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onClick, rowIndex, columnIndex, color]);

        const handleOnPointerDown = useCallback(() => {
            onPointerDown?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerDown, rowIndex, columnIndex, color]);

        const handleOnPointerUp = useCallback(() => {
            onPointerUp?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerUp, rowIndex, columnIndex, color]);

        const handleOnPointerOver = useCallback(() => {
            onPointerOver?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerOver, rowIndex, columnIndex, color]);

        const handleOnPointerEnter = useCallback(() => {
            onPointerEnter?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerEnter, rowIndex, columnIndex, color]);

        return (
            <Fragment>
                <Rect
                    cornerRadius={2}
                    fill={color}
                    height={height}
                    stroke={isNullOrEmpty(color) ? CELL_BLANK_COLOR : CELL_BORDER_COLOR}
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
                        fill={FRAME_SELECTED_FILL_COLOR}
                        height={height}
                        opacity={0.3}
                        stroke={FRAME_SELECTED_BORDER_COLOR}
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
                        fill={CELL_DOT_COLOR}
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

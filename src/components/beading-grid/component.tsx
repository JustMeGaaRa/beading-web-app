import { createIcon } from "@chakra-ui/react";
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

export type BeadingPointerEvent = {
    cell: BeadingGridCellState;
};

export const BeadingGrid: FC<PropsWithChildren<{
    offset?: GridCellPosition;
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
                    length={grid.rows[0].cells.length}
                    offset={{ columnIndex: fringeColumnIndex, rowIndex: fringeRowIndex }}
                    orientation={"horizontal"}
                    strokeColor={DividerStrokeColor}
                    strokeWidth={1}
                />
            )}
            {children}
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
    const bottomBoundary = grid.rows[0].cells.length - offset.columnIndex;

    const truncatedColumnIndex = Math.min(Math.max(topBoundary, offset.columnIndex), grid.rows[0].cells.length);
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

export const LoomIcon = createIcon({
    displayName: "LoomIcon",
    viewBox: "0 0 32 32",
    defaultProps: {
        fill: "#1A202C"
    },
    path: [
        <rect x="7.5" y="3" width="5" height="8" rx="2" fill="#A0AEC0"/>,
        <rect x="7.5" y="12" width="5" height="8" rx="2" fill="#A0AEC0"/>,
        <rect x="7.5" y="21" width="5" height="8" rx="2" fill="#A0AEC0"/>,
        <rect x="13.5" y="3" width="5" height="8" rx="2" fill="currentColor"/>,
        <rect x="13.5" y="12" width="5" height="8" rx="2" fill="currentColor"/>,
        <rect x="13.5" y="21" width="5" height="8" rx="2" fill="currentColor"/>,
        <rect x="19.5" y="3" width="5" height="8" rx="2" fill="#A0AEC0"/>,
        <rect x="19.5" y="12" width="5" height="8" rx="2" fill="#A0AEC0"/>,
        <rect x="19.5" y="21" width="5" height="8" rx="2" fill="#A0AEC0"/>
    ]
});

export const PeyoteIcon = createIcon({
    displayName: "PeyoteIcon",
    viewBox: "0 0 32 32",
    defaultProps: {
        fill: "#1A202C"
    },
    path: [
        <rect x="18.5" y="24" width="5" height="8" rx="2" transform="rotate(180 18.5 24)" fill="currentColor"/>,
        <rect x="18.5" y="15" width="5" height="8" rx="2" transform="rotate(180 18.5 15)" fill="currentColor"/>,
        <rect x="24.5" y="28.5" width="5" height="8" rx="2" transform="rotate(180 24.5 28.5)" fill="#A0AEC0"/>,
        <rect x="24.5" y="19.5" width="5" height="8" rx="2" transform="rotate(180 24.5 19.5)" fill="currentColor"/>,
        <rect x="24.5" y="10.5" width="5" height="8" rx="2" transform="rotate(180 24.5 10.5)" fill="#A0AEC0"/>,
        <rect x="12.5" y="28.5" width="5" height="8" rx="2" transform="rotate(180 12.5 28.5)" fill="#A0AEC0"/>,
        <rect x="12.5" y="19.5" width="5" height="8" rx="2" transform="rotate(180 12.5 19.5)" fill="currentColor"/>,
        <rect x="12.5" y="10.5" width="5" height="8" rx="2" transform="rotate(180 12.5 10.5)" fill="#A0AEC0"/>
    ]
});

export const BrickIcon = createIcon({
    displayName: "BrickIcon",
    viewBox: "0 0 32 32",
    defaultProps: {
        fill: "#1A202C"
    },
    path: [
        <rect x="7.5" y="18" width="5" height="8" rx="2" transform="rotate(-90 7.5 18)" fill="currentColor"/>,
        <rect x="16.5" y="18" width="5" height="8" rx="2" transform="rotate(-90 16.5 18)" fill="currentColor"/>,
        <rect x="3" y="24" width="5" height="8" rx="2" transform="rotate(-90 3 24)" fill="#A0AEC0"/>,
        <rect x="12" y="24" width="5" height="8" rx="2" transform="rotate(-90 12 24)" fill="currentColor"/>,
        <rect x="21" y="24" width="5" height="8" rx="2" transform="rotate(-90 21 24)" fill="#A0AEC0"/>,
        <rect x="3" y="12" width="5" height="8" rx="2" transform="rotate(-90 3 12)" fill="#A0AEC0"/>,
        <rect x="12" y="12" width="5" height="8" rx="2" transform="rotate(-90 12 12)" fill="currentColor"/>,
        <rect x="21" y="12" width="5" height="8" rx="2" transform="rotate(-90 21 12)" fill="#A0AEC0"/>
    ]
});

import { FC, PropsWithChildren, useCallback } from "react";
import { Group } from "react-konva";
import { BeadingPointerEvent } from "../types";
import { GridCell } from "./GridCell";
import { GridDivider } from "./GridDivider";
import { DIVIDER_STROKE_COLOR } from "../constants";
import { useGridOptions } from "../hooks";
import { BeadingGridOffset, BeadingGridState } from "../types";
import { getGridCellRenderPosition } from "../utils";

export const BeadingGrid: FC<PropsWithChildren<{
    offset?: BeadingGridOffset;
    grid: BeadingGridState;
    onCellClick?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}>> = ({
    children, offset, grid, onCellClick, onCellPointerDown, onCellPointerUp, onCellPointerEnter,
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
                {grid.rows.map((row, rowIndex) => row.cells.map((cell, columnIndex) => (
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
                        onPointerEnter={handleOnCellPointerEnter} />
                ))
                )}
                {grid.options.type === "brick" && (
                    <GridDivider
                        length={grid.rows[0]?.cells.length ?? 0}
                        offset={{ columnIndex: fringeColumnIndex, rowIndex: fringeRowIndex }}
                        orientation={"horizontal"}
                        strokeColor={DIVIDER_STROKE_COLOR}
                        strokeWidth={1} />
                )}
                {children}
            </Group>
        );
    };

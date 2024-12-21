import { FC, PropsWithChildren, useCallback, useEffect } from "react";
import { Group } from "react-konva";
import { BeadingGridCellState, BeadingGridProperties, BeadingGridState, BeadingPointerEvent } from "../types";
import { BeadingGridCell } from "./BeadingGridCell";
import { BeadingGridDivider } from "./BeadingGridDivider";
import { DIVIDER_STROKE_COLOR } from "../constants";
import { useGrid, useGridStyles } from "../hooks";
import { BeadingGridOffset } from "../types";
import { KonvaEventObject } from "konva/lib/Node";
import { hitTest } from "../utils";

export const BeadingGrid: FC<PropsWithChildren<{
    offset?: BeadingGridOffset;
    cells?: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
    onCellPointerDown?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerUp?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellPointerLeave?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}>> = ({
    children,
    offset: offsetProps,
    cells: cellsProps,
    options: optionsProps,
    onCellPointerDown,
    onCellPointerUp,
    onCellPointerEnter,
    onCellPointerLeave,
}) => {
        const { styles } = useGridStyles();
        const { cells, offset, options, setCells, setOffset, setOptions } = useGrid();

        useEffect(() => setOffset(offsetProps ?? { columnIndex: 0, rowIndex: 0 }), [offsetProps]);
        useEffect(() => setCells(cellsProps ?? []), [cellsProps]);
        useEffect(() => setOptions(optionsProps), [optionsProps]);

        const handleOnMouseDown = useCallback((event: KonvaEventObject<MouseEvent>) => {
            const gridState = { name: "", offset, cells, options };
            const cursor = { x: event.evt.offsetX, y: event.evt.offsetY };
            const hitResult = hitTest(gridState, styles, cursor);
            const cell = { offset: hitResult.hitResult, color: "" };
            onCellPointerDown?.(gridState, { cell });
        }, [onCellPointerDown]);

        const handleOnMouseUp = useCallback((event: KonvaEventObject<MouseEvent>) => {
            const gridState = { name: "", offset, cells, options };
            const cursor = { x: event.evt.offsetX, y: event.evt.offsetY };
            const hitResult = hitTest(gridState, styles, cursor);
            const cell = { offset: hitResult.hitResult, color: "" };
            onCellPointerUp?.(gridState, { cell });
        }, [onCellPointerUp]);

        const handleOnMouseEnter = useCallback((event: KonvaEventObject<MouseEvent>) => {
            const gridState = { name: "", offset, cells, options };
            const cursor = { x: event.evt.offsetX, y: event.evt.offsetY };
            const hitResult = hitTest(gridState, styles, cursor);
            const cell = { offset: hitResult.hitResult, color: "" };
            onCellPointerEnter?.(gridState, { cell });
        }, [onCellPointerEnter]);

        const handleOnMouseLeave = useCallback((event: KonvaEventObject<MouseEvent>) => {
            const gridState = { name: "", offset, cells, options };
            const cursor = { x: event.evt.offsetX, y: event.evt.offsetY };
            const hitResult = hitTest(gridState, styles, cursor);
            const cell = { offset: hitResult.hitResult, color: "" };
            onCellPointerLeave?.(gridState, { cell });
        }, [onCellPointerLeave]);

        const width = styles.bead.width * styles.rendering.pixelPerPoint;
        const height = styles.bead.height * styles.rendering.pixelPerPoint;
        const positionX = (offset?.columnIndex ?? 0) * width;
        const positionY = (offset?.rowIndex ?? 0) * height;

        return (
            <Group
                x={positionX}
                y={positionY}
                height={height}
                width={width}
                onMouseDown={handleOnMouseDown}
                onMouseUp={handleOnMouseUp}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
            >
                {children}
                {cells.map(cell => (
                    <BeadingGridCell
                        key={`${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                        color={cell.color}
                        offset={cell.offset}
                    />
                ))
                }
                {options.type === "brick" && (
                    <BeadingGridDivider
                        length={options.width}
                        offset={{ columnIndex: 0, rowIndex: options.height }}
                        orientation={"horizontal"}
                        strokeColor={DIVIDER_STROKE_COLOR}
                        strokeWidth={1} />
                )}
            </Group>
        );
    };



import { FC, PropsWithChildren, useCallback, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { BeadingGridCellState, BeadingGridProperties, BeadingGridState, BeadingPointerEvent } from "../types";
import { BeadingGridCell } from "./BeadingGridCell";
import { BeadingGridDivider } from "./BeadingGridDivider";
import { useGrid, useGridStyles, usePointerDisclosure } from "../hooks";
import { BeadingGridOffset } from "../types";
import { KonvaEventObject } from "konva/lib/Node";
import { getGridRenderSize, hitTestCursor } from "../utils";

export const BeadingGrid: FC<PropsWithChildren<{
    offset?: BeadingGridOffset;
    cells?: Array<BeadingGridCellState>;
    options: BeadingGridProperties;
    onCellEnter?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
    onCellLeave?: (source: BeadingGridState, event: BeadingPointerEvent) => void;
}>> = ({
    children,
    offset: offsetProps,
    cells: cellsProps,
    options: optionsProps,
    onCellEnter,
}) => {
        const { styles } = useGridStyles();
        const { cells, offset, options, setCells, setOffset, setOptions } = useGrid();
        const { isPointerDown, onPointerDown, onPointerUp } = usePointerDisclosure();

        useEffect(() => setOffset(offsetProps ?? { columnIndex: 0, rowIndex: 0 }), [offsetProps]);
        useEffect(() => setCells(cellsProps ?? []), [cellsProps]);
        useEffect(() => setOptions(optionsProps), [optionsProps]);

        const handleOnMouseDown = useCallback(() => {
            onPointerDown();
        }, [onCellEnter]);

        const handleOnMouseUp = useCallback(() => {
            onPointerUp();
        }, [onPointerUp]);

        const handleOnMouseMove = useCallback((event: KonvaEventObject<MouseEvent>) => {
            const gridState = { name: "", offset, cells, options };
            const cursor = event.currentTarget.getRelativePointerPosition() ?? { x: 0, y: 0 };
            const hitResults = hitTestCursor(gridState, styles, cursor);
            // TODO: check if hitResults is empty
            const gridEvent = {
                cell: hitResults.hits[0]!,
                isPointerDown: isPointerDown
            };

            onCellEnter?.(gridState, gridEvent);
        }, [onCellEnter, isPointerDown]);

        const { height, width } = getGridRenderSize(options, styles);
        const positionX = (offset?.columnIndex ?? 0) * width;
        const positionY = (offset?.rowIndex ?? 0) * height;

        return (
            <Group x={positionX} y={positionY}>
                <Rect
                    fill={"transparent"}
                    height={height}
                    width={width}
                    onMouseDown={handleOnMouseDown}
                    onMouseUp={handleOnMouseUp}
                    onMouseMove={handleOnMouseMove}
                />

                {children}
                {cells.map(cell => (
                    <BeadingGridCell
                        key={`${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                        color={cell.color}
                        offset={cell.offset}
                        isSelected={cell.isSelected}
                    />
                ))}
                {options.type === "brick" && options.fringe > 0 && (
                    <BeadingGridDivider
                        length={options.width}
                        offset={{ columnIndex: 0, rowIndex: options.height }}
                        orientation={"horizontal"}
                    />
                )}
            </Group>
        );
    };



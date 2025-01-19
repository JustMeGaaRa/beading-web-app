import { FC, PropsWithChildren, useCallback, useEffect } from "react";
import { Group, Layer, Rect } from "react-konva";
import {
    BeadingGridCellState,
    BeadingGridProperties,
    BeadingGridState,
    BeadingPointerEvent,
} from "../types";
import { BeadeeGridCell } from "./BeadeeGridCell";
import { BeadeeGridDivider } from "./BeadeeGridDivider";
import { useGrid, useGridStyles, usePointerDisclosure } from "../hooks";
import { BeadingGridOffset } from "../types";
import { KonvaEventObject } from "konva/lib/Node";
import { getGridRenderBounds, hitTestCursor } from "../utils";

export const BeadeeGrid: FC<
    PropsWithChildren<{
        gridId?: string;
        name?: string;
        offset?: BeadingGridOffset;
        cells?: Array<BeadingGridCellState>;
        options: BeadingGridProperties;
        onCellEnter?: (
            source: BeadingGridState,
            event: BeadingPointerEvent
        ) => void;
        onCellLeave?: (
            source: BeadingGridState,
            event: BeadingPointerEvent
        ) => void;
        onCellClick?: (
            source: BeadingGridState,
            event: BeadingPointerEvent
        ) => void;
    }>
> = ({
    children,
    gridId: gridIdProps,
    name: nameProps,
    offset: offsetProps,
    cells: cellsProps,
    options: optionsProps,
    onCellEnter,
    onCellClick,
}) => {
    const { styles } = useGridStyles();
    const {
        gridId,
        name,
        cells,
        offset,
        options,
        setGridId,
        setName,
        setCells,
        setOffset,
        setOptions,
    } = useGrid();
    const { isPointerDown, onPointerDown, onPointerUp } =
        usePointerDisclosure();

    useEffect(() => setGridId(gridIdProps ?? ""), [gridIdProps]);
    useEffect(() => setName(nameProps ?? ""), [nameProps]);
    useEffect(
        () => setOffset(offsetProps ?? { columnIndex: 0, rowIndex: 0 }),
        [offsetProps]
    );
    useEffect(() => setCells(cellsProps ?? []), [cellsProps]);
    useEffect(() => setOptions(optionsProps), [optionsProps]);

    const handleOnPointerDown = useCallback(() => {
        onPointerDown();
    }, [onCellEnter]);

    const handleOnPointerUp = useCallback(() => {
        onPointerUp();
    }, [onPointerUp]);

    const handleOnPointerMove = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const gridState = { gridId, name, offset, cells, options };
            const stage = event.currentTarget.getStage();
            const cursor = stage?.getRelativePointerPosition() ?? {
                x: 0,
                y: 0,
            };
            const hitResults = hitTestCursor(gridState, styles, cursor);
            // TODO: check if hitResults is empty
            const gridEvent = {
                cell: hitResults.hits[0]!,
                isPointerDown: isPointerDown,
            };

            onCellEnter?.(gridState, gridEvent);
        },
        [onCellEnter, isPointerDown]
    );

    const handleOnPointerClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const gridState = { gridId, name, offset, cells, options };
            const stage = event.currentTarget.getStage();
            const cursor = stage?.getRelativePointerPosition() ?? {
                x: 0,
                y: 0,
            };
            const hitResults = hitTestCursor(gridState, styles, cursor);
            // TODO: check if hitResults is empty
            const gridEvent = {
                cell: hitResults.hits[0]!,
                isPointerDown: false,
            };

            onCellClick?.(gridState, gridEvent);
        },
        [onCellClick]
    );

    const gridRenderBounds = getGridRenderBounds(offset, options, styles);

    return (
        <Layer x={gridRenderBounds.position.x} y={gridRenderBounds.position.y}>
            <Group name={gridId}></Group>
            <Rect
                fill={"transparent"}
                height={gridRenderBounds.height}
                width={gridRenderBounds.width}
                onPointerDown={handleOnPointerDown}
                onPointerUp={handleOnPointerUp}
                onPointerMove={handleOnPointerMove}
                onPointerClick={handleOnPointerClick}
            />
            {cells.map((cell) => (
                <BeadeeGridCell
                    key={`${cell.offset.rowIndex}-${cell.offset.columnIndex}`}
                    color={cell.color}
                    offset={cell.offset}
                />
            ))}
            {options.type === "brick" && options.fringe > 0 && (
                <BeadeeGridDivider
                    length={options.width}
                    offset={{ columnIndex: 0, rowIndex: options.height }}
                    orientation={"horizontal"}
                />
            )}
            {children}
        </Layer>
    );
};

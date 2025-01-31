import { FC, PropsWithChildren, useCallback } from "react";
import { Group, Rect } from "react-konva";
import {
    BeadingGridCell,
    BeadingGridProperties,
    BeadingGrid,
    BeadingPointerEvent,
    getCellKey,
    shiftOffset,
} from "../types";
import { BeadeeGridCell } from "./BeadeeGridCell";
import { BeadeeGridDivider } from "./BeadeeGridDivider";
import {
    useBeadeeGridMetadata,
    useBeadeeGridStyles,
    usePointerDisclosure,
} from "../hooks";
import { BeadingGridOffset } from "../types";
import { KonvaEventObject } from "konva/lib/Node";
import {
    getGridRenderBounds,
    getCellAtPosition,
    getStageRelativePosition,
} from "../utils";
import { BeadeeGridProvider } from "./BeadeeGridProvider";
import { BeadeeRenderBoundsProvider } from "./BeadeeRenderBoundsProvider";
import { BeadeeGridOptionsContext } from "../context";

export const BeadeeGrid: FC<
    PropsWithChildren<{
        id: string;
        name: string;
        offset: BeadingGridOffset;
        cells: Array<BeadingGridCell>;
        options: BeadingGridProperties;
        onCellEnter?: (source: BeadingGrid, event: BeadingPointerEvent) => void;
        onCellLeave?: (source: BeadingGrid, event: BeadingPointerEvent) => void;
        onCellClick?: (source: BeadingGrid, event: BeadingPointerEvent) => void;
    }>
> = ({
    children,
    id,
    name,
    offset,
    cells,
    options,
    onCellEnter,
    onCellClick,
}) => {
    const { styles } = useBeadeeGridStyles();
    const { metadata } = useBeadeeGridMetadata();
    const { isPointerDown, onPointerDown, onPointerMove, onPointerUp } =
        usePointerDisclosure();

    const handleOnPointerDown = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const cursor = getStageRelativePosition(
                event.currentTarget.getStage()
            );
            onPointerDown(cursor);
        },
        [onCellEnter]
    );

    const handleOnPointerUp = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            const cursor = getStageRelativePosition(
                event.currentTarget.getStage()
            );
            onPointerUp(cursor);
        },
        [onPointerUp]
    );

    const handleOnPointerMove = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (onCellEnter) {
                const gridState = { gridId: id, name, offset, cells, options };
                const cursor = getStageRelativePosition(
                    event.currentTarget.getStage()
                );
                const hitResults = getCellAtPosition(gridState, styles, cursor);
                // TODO: check if hitResults is empty
                const gridEvent = {
                    cell: hitResults.hits[0]!,
                    isPointerDown: isPointerDown,
                };

                onCellEnter?.(gridState, gridEvent);
                onPointerMove(cursor);
            }
        },
        [onCellEnter, isPointerDown]
    );

    const handleOnPointerClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            if (onCellClick) {
                const gridState = { gridId: id, name, offset, cells, options };
                const cursor = getStageRelativePosition(
                    event.currentTarget.getStage()
                );
                const hitResults = getCellAtPosition(gridState, styles, cursor);
                // TODO: check if hitResults is empty
                const gridEvent = {
                    cell: hitResults.hits[0]!,
                    isPointerDown: false,
                };

                onCellClick?.(gridState, gridEvent);
                onPointerDown(cursor);
                onPointerUp(cursor);
            }
        },
        [onCellClick]
    );

    const gridRenderBounds =
        metadata?.gridBounds ?? getGridRenderBounds(offset, options, styles);

    return (
        <BeadeeRenderBoundsProvider {...gridRenderBounds}>
            <BeadeeGridProvider
                gridId={id}
                name={name}
                cells={cells}
                offset={offset}
                options={options}
            >
                <Group
                    name={id}
                    x={gridRenderBounds.position.x}
                    y={gridRenderBounds.position.y}
                >
                    <Rect
                        fill={"transparent"}
                        height={gridRenderBounds.height}
                        width={gridRenderBounds.width}
                        onPointerDown={handleOnPointerDown}
                        onPointerUp={handleOnPointerUp}
                        onPointerMove={handleOnPointerMove}
                        onPointerClick={handleOnPointerClick}
                    />
                    {options.type === "brick" && options.fringe > 0 && (
                        <BeadeeGridDivider
                            length={options.width}
                            offset={{
                                columnIndex: 0,
                                rowIndex: options.height,
                            }}
                            orientation={"horizontal"}
                        />
                    )}
                    {children}
                </Group>
                {cells.map((cell) => (
                    <BeadeeGridCell
                        key={getCellKey(cell)}
                        color={cell.color}
                        offset={shiftOffset(cell.offset, offset)}
                    />
                ))}
            </BeadeeGridProvider>
        </BeadeeRenderBoundsProvider>
    );
};

export const BeadeeGridOptionsProvider: FC<
    PropsWithChildren<{ options: BeadingGridProperties }>
> = ({ children, options }) => {
    return (
        <BeadeeGridOptionsContext.Provider value={{ options }}>
            {children}
        </BeadeeGridOptionsContext.Provider>
    );
};

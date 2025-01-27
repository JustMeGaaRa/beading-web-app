import { FC, PropsWithChildren, useCallback } from "react";
import { Group, Rect } from "react-konva";
import {
    BeadingGridCell,
    BeadingGridProperties,
    BeadingGrid,
    BeadingPointerEvent,
    getCellKey,
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
import { getGridRenderBounds, getCellAtPosition } from "../utils";
import { BeadeeGridProvider } from "./BeadeeGridProvider";
import { BeadeeRenderBoundsProvider } from "./BeadeeRenderBoundsProvider";
import { BeadeeGridOptionsContext } from "../context";

export const BeadeeGrid: FC<
    PropsWithChildren<{
        gridId: string;
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
    gridId,
    name,
    offset,
    cells,
    options,
    onCellEnter,
    onCellClick,
}) => {
    const { styles } = useBeadeeGridStyles();
    const { metadata } = useBeadeeGridMetadata();
    const { isPointerDown, onPointerDown, onPointerUp } =
        usePointerDisclosure();

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
            const hitResults = getCellAtPosition(gridState, styles, cursor);
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
            const hitResults = getCellAtPosition(gridState, styles, cursor);
            // TODO: check if hitResults is empty
            const gridEvent = {
                cell: hitResults.hits[0]!,
                isPointerDown: false,
            };

            onCellClick?.(gridState, gridEvent);
        },
        [onCellClick]
    );

    const gridRenderBounds =
        metadata?.gridBounds ?? getGridRenderBounds(offset, options, styles);

    return (
        <BeadeeRenderBoundsProvider {...gridRenderBounds}>
            <BeadeeGridProvider
                gridId={gridId}
                name={name}
                cells={cells}
                offset={offset}
                options={options}
            >
                <Group
                    x={gridRenderBounds.position.x}
                    y={gridRenderBounds.position.y}
                >
                    <Group name={gridId}>
                        <Rect
                            fill={"transparent"}
                            height={gridRenderBounds.height}
                            width={gridRenderBounds.width}
                            onPointerDown={handleOnPointerDown}
                            onPointerUp={handleOnPointerUp}
                            onPointerMove={handleOnPointerMove}
                            onPointerClick={handleOnPointerClick}
                        />
                    </Group>
                    {cells.map((cell) => (
                        <BeadeeGridCell
                            key={getCellKey(cell)}
                            color={cell.color}
                            offset={cell.offset}
                        />
                    ))}
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

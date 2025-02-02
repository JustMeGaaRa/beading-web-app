import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback } from "react";
import { Group } from "react-konva";
import { BeadingFrameRowLabels } from "./BeadeeFrameRowLabels";
import { BeadeeFrameColumnLabels } from "./BeadeeFrameColumnLabels";
import { BeadeeFrameMiddleMarker } from "./BeadeeFrameMiddleMarker";
import {
    useBeadeeGridStyles,
    useBeadeeGridSelection,
    useBeadeeRenderBounds,
} from "../hooks";
import { BeadingGridProperties, ColumnEvent, RowEvent } from "../types";
import { getCellRenderSize } from "@beadee/grid-editor";

export const BeadeeFrameLabels: FC<{
    options: BeadingGridProperties;
    height: number;
    width: number;
    isVisible?: boolean;
    onColumnClick?: (
        event: KonvaEventObject<MouseEvent>,
        source: ColumnEvent
    ) => void;
    onRowClick?: (
        event: KonvaEventObject<MouseEvent>,
        source: RowEvent
    ) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    options,
    height,
    width,
    isVisible,
    onColumnClick,
    onRowClick,
    onContextMenu,
}) => {
    const { styles } = useBeadeeGridStyles();
    const {
        position,
        height: renderHeight,
        width: renderWidth,
    } = useBeadeeRenderBounds();
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow } =
        useBeadeeGridSelection();

    const bead = getCellRenderSize(options, styles);
    const frameTextMarginX = bead.width / 2;
    const frameTextMarginY = bead.height / 4;

    const handleOnRowClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, source: RowEvent) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(-1);
            setSelectedRow(source.rowIndex);
            onRowClick?.(event, source);
        },
        [setSelectedColumn, setSelectedRow, onRowClick]
    );

    const handleOnColumnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, source: ColumnEvent) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(source.columnIndex);
            setSelectedRow(-1);
            onColumnClick?.(event, source);
        },
        [setSelectedColumn, setSelectedRow, onColumnClick]
    );

    return (
        isVisible && (
            <Group>
                {Array.from({ length: width }).map((_, columnIndex) => (
                    <BeadeeFrameColumnLabels
                        key={`column-label-${columnIndex}`}
                        cellHeight={bead.height}
                        cellWidth={bead.width}
                        columnIndex={columnIndex}
                        marginY={frameTextMarginY}
                        isSelected={selectedColumn === columnIndex}
                        onClick={handleOnColumnClick}
                        onContextMenu={onContextMenu}
                    />
                ))}
                {Array.from({ length: height }).map((_, rowIndex) => (
                    <BeadingFrameRowLabels
                        key={`row-label-${rowIndex}`}
                        cellHeight={bead.height}
                        cellWidth={bead.width}
                        rowIndex={rowIndex}
                        marginX={frameTextMarginX}
                        isSelected={selectedRow === rowIndex}
                        onClick={handleOnRowClick}
                        onContextMenu={onContextMenu}
                    />
                ))}
                <BeadeeFrameMiddleMarker
                    orientation={"vertical"}
                    x={(position.x + renderWidth) / 2}
                    y={-bead.height * 2}
                    height={bead.height}
                    width={bead.width}
                />
                <BeadeeFrameMiddleMarker
                    orientation={"horizontal"}
                    x={-bead.width * 2}
                    y={(position.y + renderHeight) / 2}
                    height={bead.height}
                    width={bead.width}
                />
            </Group>
        )
    );
};

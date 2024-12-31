import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback } from "react";
import { Group } from "react-konva";
import { BeadingFrameRowLabels } from "./BeadingFrameRowLabels";
import { BeadingFrameColumnLabels } from "./BeadingFrameColumnLabels";
import { BeadingFrameMiddleMarker } from "./BeadingFrameMiddleMarker";
import { useGridStyles, useGridSelection } from "../hooks";
import { BeadingGridProperties, TextState } from "../types";
import { getGridCellRenderSize } from "@repo/bead-grid";

export const BeadingFrame: FC<{
    options: BeadingGridProperties;
    height: number;
    width: number;
    onColumnClick?: (
        event: KonvaEventObject<MouseEvent>,
        columnState: TextState
    ) => void;
    onRowClick?: (
        event: KonvaEventObject<MouseEvent>,
        rowState: TextState
    ) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({ options, height, width, onColumnClick, onRowClick, onContextMenu }) => {
    const { styles } = useGridStyles();
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow } =
        useGridSelection();

    const { height: cellHeight, width: cellWidth } = getGridCellRenderSize(
        options,
        styles
    );
    const frameTextMarginX = cellWidth / 2;
    const frameTextMarginY = cellHeight / 4;

    const handleOnRowClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(-1);
            setSelectedRow(rowState.patternIndex);
            onRowClick?.(event, rowState);
        },
        [setSelectedColumn, setSelectedRow, onRowClick]
    );

    const handleOnColumnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(columnState.patternIndex);
            setSelectedRow(-1);
            onColumnClick?.(event, columnState);
        },
        [setSelectedColumn, setSelectedRow, onColumnClick]
    );

    const columnsTextArray: Array<TextState> = Array.from(
        { length: width },
        (_, index) => ({
            gridIndex: index,
            gridName: "all",
            patternIndex: index,
        })
    );
    const rowTextArray: Array<TextState> = Array.from(
        { length: height },
        (_, index) => ({
            gridIndex: index,
            gridName: "all",
            patternIndex: index,
        })
    );

    return (
        <Group>
            {columnsTextArray.map((column) => (
                <BeadingFrameColumnLabels
                    key={`column-label-${column.patternIndex}`}
                    cellHeight={cellHeight}
                    cellWidth={cellWidth}
                    gridName={column.gridName}
                    gridIndex={column.gridIndex}
                    patternIndex={column.patternIndex}
                    marginY={frameTextMarginY}
                    rows={height}
                    isSelected={selectedColumn === column.patternIndex}
                    onClick={handleOnColumnClick}
                    onContextMenu={onContextMenu}
                />
            ))}
            {rowTextArray.map((row) => (
                <BeadingFrameRowLabels
                    key={`row-label-${row.patternIndex}`}
                    cellHeight={cellHeight}
                    cellWidth={cellWidth}
                    gridName={row.gridName}
                    gridIndex={row.gridIndex}
                    patternIndex={row.patternIndex}
                    marginX={frameTextMarginX}
                    columns={width}
                    isSelected={selectedRow === row.patternIndex}
                    onClick={handleOnRowClick}
                    onContextMenu={onContextMenu}
                />
            ))}
            <BeadingFrameMiddleMarker
                orientation={"vertical"}
                x={(width * cellWidth) / 2 + cellWidth / 2}
                y={-cellHeight * 2}
                height={cellHeight}
                width={cellWidth}
            />
            <BeadingFrameMiddleMarker
                orientation={"horizontal"}
                x={-cellWidth * 2}
                y={(height * cellHeight) / 2 + cellHeight / 2}
                height={cellHeight}
                width={cellWidth}
            />
        </Group>
    );
};

import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback } from "react";
import { Group } from "react-konva";
import { BeadingFrameRowLabels } from "./BeadeeFrameRowLabels";
import { BeadeeFrameColumnLabels } from "./BeadeeFrameColumnLabels";
import { BeadeeFrameMiddleMarker } from "./BeadeeFrameMiddleMarker";
import { useBeadeeGridStyles, useBeadeeGridSelection } from "../hooks";
import { BeadingGridProperties, TextState } from "../types";
import { getCellRenderSize } from "@beadee/grid-editor";

export const BeadeeFrameLabels: FC<{
    options: BeadingGridProperties;
    height: number;
    width: number;
    isVisible?: boolean;
    onColumnClick?: (
        event: KonvaEventObject<MouseEvent>,
        columnState: TextState
    ) => void;
    onRowClick?: (
        event: KonvaEventObject<MouseEvent>,
        rowState: TextState
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
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow } =
        useBeadeeGridSelection();

    const bead = getCellRenderSize(options, styles);
    const frameTextMarginX = bead.width / 2;
    const frameTextMarginY = bead.height / 4;

    const handleOnRowClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(-1);
            setSelectedRow(rowState.absoluteIndex);
            onRowClick?.(event, rowState);
        },
        [setSelectedColumn, setSelectedRow, onRowClick]
    );

    const handleOnColumnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(columnState.absoluteIndex);
            setSelectedRow(-1);
            onColumnClick?.(event, columnState);
        },
        [setSelectedColumn, setSelectedRow, onColumnClick]
    );

    const columnsTextArray: Array<TextState> = Array.from(
        { length: width },
        (_, index) => ({
            // TODO: calculate relative index
            gridId: "all",
            relativeIndex: index,
            absoluteIndex: index,
        })
    );
    const rowTextArray: Array<TextState> = Array.from(
        { length: height },
        (_, index) => ({
            // TODO: calculate relative index
            gridId: "all",
            relativeIndex: index,
            absoluteIndex: index,
        })
    );

    return (
        isVisible && (
            <Group>
                {columnsTextArray.map((column) => (
                    <BeadeeFrameColumnLabels
                        key={`column-label-${column.absoluteIndex}`}
                        cellHeight={bead.height}
                        cellWidth={bead.width}
                        gridId={column.gridId}
                        gridIndex={column.relativeIndex}
                        patternIndex={column.absoluteIndex}
                        marginY={frameTextMarginY}
                        rows={height}
                        isSelected={selectedColumn === column.absoluteIndex}
                        onClick={handleOnColumnClick}
                        onContextMenu={onContextMenu}
                    />
                ))}
                {rowTextArray.map((row) => (
                    <BeadingFrameRowLabels
                        key={`row-label-${row.absoluteIndex}`}
                        cellHeight={bead.height}
                        cellWidth={bead.width}
                        gridId={row.gridId}
                        gridIndex={row.relativeIndex}
                        patternIndex={row.absoluteIndex}
                        marginX={frameTextMarginX}
                        columns={width}
                        isSelected={selectedRow === row.absoluteIndex}
                        onClick={handleOnRowClick}
                        onContextMenu={onContextMenu}
                    />
                ))}
                <BeadeeFrameMiddleMarker
                    orientation={"vertical"}
                    x={(width * bead.width) / 2 + bead.width / 2}
                    y={-bead.height * 2}
                    height={bead.height}
                    width={bead.width}
                />
                <BeadeeFrameMiddleMarker
                    orientation={"horizontal"}
                    x={-bead.width * 2}
                    y={(height * bead.height) / 2 + bead.height / 2}
                    height={bead.height}
                    width={bead.width}
                />
            </Group>
        )
    );
};

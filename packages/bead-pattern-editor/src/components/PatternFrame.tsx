import { CELL_PIXEL_RATIO } from "@repo/bead-grid";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback } from "react";
import { Group } from "react-konva";
import { PatternFrameRow } from "./PatternFrameRow";
import { PatternFrameColumn } from "./PatternFrameColumn";
import { PatternMiddleMarker } from "./PatternMiddleMarker";
import { usePatternSelection } from "../hooks";
import { PatternOptions, PatternState, TextState } from "../types";
import { getPatternSize } from "../utils";

export const PatternFrame: FC<{
    pattern: PatternState;
    options: PatternOptions;
    onColumnClick?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
    onRowClick?: (event: KonvaEventObject<MouseEvent>, rowState: TextState) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    pattern, options, onColumnClick, onRowClick, onContextMenu,
}) => {
        const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow } = usePatternSelection();

        const cellHeight = pattern.grids.some((grid) => grid.options.type === "brick")
            ? options.layout.beadSize.width * CELL_PIXEL_RATIO
            : options.layout.beadSize.height * CELL_PIXEL_RATIO;
        const cellWidth = pattern.grids.some((grid) => grid.options.type === "brick")
            ? options.layout.beadSize.height * CELL_PIXEL_RATIO
            : options.layout.beadSize.width * CELL_PIXEL_RATIO;

        const { height: rows, width: columns } = getPatternSize(pattern);

        const frameTextMarginX = cellWidth / 2;
        const frameTextMarginY = cellHeight / 4;

        const handleOnRowClick = useCallback((event: KonvaEventObject<MouseEvent>, rowState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(-1);
            setSelectedRow(rowState.patternIndex);
            onRowClick?.(event, rowState);
        }, [setSelectedColumn, setSelectedRow, onRowClick]);

        const handleOnColumnClick = useCallback((event: KonvaEventObject<MouseEvent>, columnState: TextState) => {
            event.evt.preventDefault();
            event.cancelBubble = true;
            setSelectedColumn(columnState.patternIndex);
            setSelectedRow(-1);
            onColumnClick?.(event, columnState);
        }, [setSelectedColumn, setSelectedRow, onColumnClick]);

        const isHorizontal = pattern.options.layout.orientation === "horizontal";
        const columnsTextArray: Array<TextState> = isHorizontal
            ? pattern.grids
                .flatMap((grid) => grid.rows[0].cells.map((_, columnIndex) => ({ gridIndex: columnIndex, gridName: grid.name })
                ))
                .map((columnState, columnIndex) => ({ ...columnState, patternIndex: columnIndex }))
            : Array.from({ length: columns }, (_, index) => ({ gridIndex: index, gridName: "all", patternIndex: index })
            );
        const rowTextArray: Array<TextState> = isHorizontal
            ? Array.from({ length: rows }, (_, index) => ({ gridIndex: index, gridName: "all", patternIndex: index })
            )
            : pattern.grids
                .flatMap((grid) => grid.rows.map((_, rowIndex) => ({ gridIndex: rowIndex, gridName: grid.name })
                ))
                .map((rowState, rowIndex) => ({ ...rowState, patternIndex: rowIndex }));

        return (
            <Group>
                {columnsTextArray.map((column) => (
                    <PatternFrameColumn
                        key={`column-number-${column.patternIndex}`}
                        cellHeight={cellHeight}
                        cellWidth={cellWidth}
                        gridName={column.gridName}
                        gridIndex={column.gridIndex}
                        patternIndex={column.patternIndex}
                        marginY={frameTextMarginY}
                        rows={rows}
                        isSelected={selectedColumn === column.patternIndex}
                        onClick={handleOnColumnClick}
                        onContextMenu={onContextMenu} />
                ))}
                {rowTextArray.map((row) => (
                    <PatternFrameRow
                        key={`row-number-${row.patternIndex}`}
                        cellHeight={cellHeight}
                        cellWidth={cellWidth}
                        gridName={row.gridName}
                        gridIndex={row.gridIndex}
                        patternIndex={row.patternIndex}
                        marginX={frameTextMarginX}
                        columns={columns}
                        isSelected={selectedRow === row.patternIndex}
                        onClick={handleOnRowClick}
                        onContextMenu={onContextMenu} />
                ))}
                <PatternMiddleMarker
                    orientation={"vertical"}
                    x={columns * cellWidth / 2 + cellWidth / 2}
                    y={-cellHeight * 2}
                    height={cellHeight}
                    width={cellWidth} />
                <PatternMiddleMarker
                    orientation={"horizontal"}
                    x={-cellWidth * 2}
                    y={rows * cellHeight / 2 + cellHeight / 2}
                    height={cellHeight}
                    width={cellWidth} />
            </Group>
        );
    };

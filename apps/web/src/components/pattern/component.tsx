import { FC, Fragment, PropsWithChildren, useCallback, useRef, useState } from "react";
import { PatternSelectionContext } from "./context";
import { PatternOptions, PatternState, TextState } from "./types";
import { Group, Line, Rect, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { getPatternSize } from "./utils";
import { usePatternSelection } from "./hooks";
import {
    BeadingGridCell,
    CELL_BLANK_COLOR,
    CELL_DOT_COLOR,
    CELL_PIXEL_RATIO,
    FRAME_SELECTED_BORDER_COLOR,
    FRAME_TEXT_COLOR
} from "beading-grid";
import { createPatterStore, PatternContext, PatternTemporalStore } from "./store";

export const PatternProvider: FC<PropsWithChildren<{
    pattern?: PatternState;
}>> = ({
    children,
    pattern
}) => {
        const storeRef = useRef<PatternTemporalStore>();

        if (!storeRef.current) {
            storeRef.current = createPatterStore(pattern);
        }

        return storeRef.current && (
            <PatternContext.Provider value={storeRef.current}>
                {children}
            </PatternContext.Provider>
        );
    };

export const PatternSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [selectedCells, setSelectedCells] = useState<Record<string, Array<BeadingGridCell>>>({});
    const [selectedColumn, setSelectedColumn] = useState(-1);
    const [selectedRow, setSelectedRow] = useState(-1);

    return (
        <PatternSelectionContext.Provider value={{
            selectedCells,
            selectedColumn,
            selectedRow,
            setSelectedCells,
            setSelectedColumn,
            setSelectedRow,
        }}>
            {children}
        </PatternSelectionContext.Provider>
    );
};

export const PatternFrame: FC<{
    pattern: PatternState;
    options: PatternOptions;
    onColumnClick?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
    onRowClick?: (event: KonvaEventObject<MouseEvent>, rowState: TextState) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    pattern,
    options,
    onColumnClick,
    onRowClick,
    onContextMenu,
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
                .flatMap((grid) =>
                    grid.rows[0].cells.map((_, columnIndex) =>
                        ({ gridIndex: columnIndex, gridName: grid.name })
                    ))
                .map((columnState, columnIndex) => ({ ...columnState, patternIndex: columnIndex }))
            : Array.from({ length: columns }, (_, index) =>
                ({ gridIndex: index, gridName: "all", patternIndex: index })
            );
        const rowTextArray: Array<TextState> = isHorizontal
            ? Array.from({ length: rows }, (_, index) =>
                ({ gridIndex: index, gridName: "all", patternIndex: index })
            )
            : pattern.grids
                .flatMap((grid) =>
                    grid.rows.map((_, rowIndex) =>
                        ({ gridIndex: rowIndex, gridName: grid.name })
                    ))
                .map((rowState, rowIndex) => ({ ...rowState, patternIndex: rowIndex }))

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
                        onContextMenu={onContextMenu}
                    />
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
                        onContextMenu={onContextMenu}
                    />
                ))}
                <PatternMiddleMarker
                    orientation={"vertical"}
                    x={columns * cellWidth / 2 + cellWidth / 2}
                    y={-cellHeight * 2}
                    height={cellHeight}
                    width={cellWidth}
                />
                <PatternMiddleMarker
                    orientation={"horizontal"}
                    x={-cellWidth * 2}
                    y={rows * cellHeight / 2 + cellHeight / 2}
                    height={cellHeight}
                    width={cellWidth}
                />
            </Group>
        );
    };

export const PatternMiddleMarker: FC<{
    orientation: "horizontal" | "vertical";
    x: number;
    y: number;
    height: number;
    width: number;
}> = ({
    orientation,
    x,
    y,
    height,
    width
}) => {
        return (

            <Group x={x} y={y}>
                {orientation === "vertical" ? (
                    <Line
                        points={[
                            - width / 2,
                            - height / 2,
                            width / 2,
                            - height / 2,
                            0,
                            height / 2
                        ]}
                        closed
                        fill={CELL_DOT_COLOR}
                        stroke={CELL_BLANK_COLOR}
                        strokeWidth={0}
                        scale={{ x: 0.5, y: 0.7 }}
                    />
                ) : (
                    <Line
                        points={[
                            -width / 2,
                            - height / 2,
                            width / 2,
                            0,
                            -width / 2,
                            height / 2
                        ]}
                        closed
                        fill={CELL_DOT_COLOR}
                        stroke={CELL_BLANK_COLOR}
                        strokeWidth={0}
                        scale={{ x: 0.7, y: 0.5 }}
                    />
                )}
            </Group>
        )
    }

export const PatternFrameColumn: FC<{
    cellHeight: number;
    cellWidth: number;
    gridIndex: number;
    gridName: string;
    patternIndex: number;
    marginY: number;
    rows: number;
    isSelected: boolean;
    onClick?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
}> = ({
    cellHeight,
    cellWidth,
    gridIndex,
    gridName,
    patternIndex,
    marginY,
    rows,
    isSelected,
    onClick,
    onContextMenu
}) => {
        const handleOnClick = useCallback((event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, { gridIndex, patternIndex, gridName });
        }, [onClick, gridIndex, patternIndex, gridName]);

        const handleOnContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, { gridIndex, patternIndex, gridName });
        }, [onContextMenu, gridIndex, patternIndex, gridName]);

        const frameTextOffsetY = cellHeight + marginY;
        const selectedColumnPositionX = patternIndex * cellWidth;
        const selectedColumnPositionY = -frameTextOffsetY;
        const selectedColumnHeight = cellHeight * rows + 2 * frameTextOffsetY;
        const selectedColumnWidth = cellWidth;

        return (
            <Fragment>
                <Text
                    key={`column-top-number-${patternIndex}`}
                    align={"center"}
                    fill={FRAME_TEXT_COLOR}
                    height={cellHeight}
                    text={(patternIndex + 1).toString()}
                    verticalAlign={"middle"}
                    width={cellWidth}
                    x={patternIndex * cellWidth}
                    y={-frameTextOffsetY}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
                <Text
                    key={`column-bottom-number-${patternIndex}`}
                    align={"center"}
                    fill={FRAME_TEXT_COLOR}
                    height={cellHeight}
                    text={(patternIndex + 1).toString()}
                    verticalAlign={"middle"}
                    width={cellWidth}
                    x={patternIndex * cellWidth}
                    y={rows * cellHeight + marginY}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
                <Rect
                    key={"selected-column-frame"}
                    cornerRadius={20}
                    height={selectedColumnHeight}
                    width={selectedColumnWidth}
                    stroke={FRAME_SELECTED_BORDER_COLOR}
                    strokeWidth={2}
                    x={selectedColumnPositionX}
                    y={selectedColumnPositionY}
                    visible={isSelected}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
            </Fragment>
        );
    };

export const PatternFrameRow: FC<{
    cellHeight: number;
    cellWidth: number;
    gridIndex: number;
    gridName: string;
    patternIndex: number;
    marginX: number;
    columns: number;
    isSelected: boolean;
    onClick?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
    onContextMenu?: (event: KonvaEventObject<MouseEvent>, columnState: TextState) => void;
}> = ({
    cellHeight,
    cellWidth,
    gridIndex,
    gridName,
    patternIndex,
    marginX,
    columns,
    isSelected,
    onClick,
    onContextMenu
}) => {
        const handleOnClick = useCallback((event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, { gridIndex, patternIndex, gridName });
        }, [onClick, gridIndex, patternIndex, gridName]);

        const handleOnContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, { gridIndex, patternIndex, gridName });
        }, [onContextMenu, gridIndex, patternIndex, gridName]);

        const frameTextOffsetX = cellWidth + marginX;
        const selectedRowPositionX = -frameTextOffsetX;
        const selectedRowPositionY = patternIndex * cellHeight;
        const selectedRowHeight = cellHeight;
        const selectedRowWidth = cellWidth * columns + 2 * frameTextOffsetX;

        return (
            <Fragment>
                <Text
                    key={`row-left-number-${patternIndex}`}
                    align={"right"}
                    fill={FRAME_TEXT_COLOR}
                    height={cellHeight}
                    text={(patternIndex + 1).toString()}
                    verticalAlign={"middle"}
                    width={cellWidth}
                    x={-frameTextOffsetX}
                    y={patternIndex * cellHeight}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
                <Text
                    key={`row-right-number-${patternIndex}`}
                    align={"left"}
                    fill={FRAME_TEXT_COLOR}
                    height={cellHeight}
                    text={(patternIndex + 1).toString()}
                    verticalAlign={"middle"}
                    width={cellWidth}
                    x={columns * cellWidth + marginX}
                    y={patternIndex * cellHeight}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
                <Rect
                    key={"selected-row-frame"}
                    cornerRadius={20}
                    height={selectedRowHeight}
                    width={selectedRowWidth}
                    stroke={FRAME_SELECTED_BORDER_COLOR}
                    strokeWidth={2}
                    x={selectedRowPositionX}
                    y={selectedRowPositionY}
                    visible={isSelected}
                    onClick={handleOnClick}
                    onContextMenu={handleOnContextMenu}
                />
            </Fragment>
        );
    };

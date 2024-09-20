import { FC, Fragment, PropsWithChildren, useCallback, useRef, useState } from "react";
import { PatternSelectionContext } from "./context";
import { PatternOptions, PatternState, TextState } from "./types";
import { Group, Rect, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { getPatternSize } from "./utils";
import { usePatternSelection } from "./hooks";
import {
    BeadingGridCell,
    CellPixelRatio,
    FrameSelectedBorderColor,
    FrameTextColor
} from "../beading-grid";
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
    const { selectedColumn, selectedRow, setSelectedColumn, setSelectedRow} = usePatternSelection();

    const cellHeight = pattern.grids.some((grid) => grid.options.type === "brick")
        ? options.layout.beadSize.width * CellPixelRatio
        : options.layout.beadSize.height * CellPixelRatio;
    const cellWidth = pattern.grids.some((grid) => grid.options.type === "brick")
        ? options.layout.beadSize.height * CellPixelRatio
        : options.layout.beadSize.width * CellPixelRatio;

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
        </Group>
    );
};

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
    }, [onClick, gridIndex, patternIndex]);

    const handleOnContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        onContextMenu?.(event, { gridIndex, patternIndex, gridName });
    }, [onContextMenu, gridIndex, patternIndex]);

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
                fill={FrameTextColor}
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
                fill={FrameTextColor}
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
                stroke={FrameSelectedBorderColor}
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
    }, [onClick, gridIndex, patternIndex]);

    const handleOnContextMenu = useCallback((event: KonvaEventObject<MouseEvent>) => {
        onContextMenu?.(event, { gridIndex, patternIndex, gridName });
    }, [onContextMenu, gridIndex, patternIndex]);

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
                fill={FrameTextColor}
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
                fill={FrameTextColor}
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
                stroke={FrameSelectedBorderColor}
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

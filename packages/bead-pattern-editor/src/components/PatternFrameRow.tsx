import { FRAME_TEXT_COLOR, FRAME_SELECTED_BORDER_COLOR } from "@repo/bead-grid";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { TextState } from "../types";

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
    cellHeight, cellWidth, gridIndex, gridName, patternIndex, marginX, columns, isSelected, onClick, onContextMenu
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
                    onContextMenu={handleOnContextMenu} />
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
                    onContextMenu={handleOnContextMenu} />
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
                    onContextMenu={handleOnContextMenu} />
            </Fragment>
        );
    };

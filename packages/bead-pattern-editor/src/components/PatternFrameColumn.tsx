import { FRAME_TEXT_COLOR, FRAME_SELECTED_BORDER_COLOR } from "@repo/bead-grid";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { TextState } from "../types";

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
    cellHeight, cellWidth, gridIndex, gridName, patternIndex, marginY, rows, isSelected, onClick, onContextMenu
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
                    onContextMenu={handleOnContextMenu} />
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
                    onContextMenu={handleOnContextMenu} />
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
                    onContextMenu={handleOnContextMenu} />
            </Fragment>
        );
    };

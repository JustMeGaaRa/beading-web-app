import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { TextState } from "../types";
import { useBeadeeGridStyles } from "../hooks";

export const BeadeeFrameColumnLabels: FC<{
    cellHeight: number;
    cellWidth: number;
    gridIndex: number;
    gridId: string;
    patternIndex: number;
    marginY: number;
    rows: number;
    isSelected: boolean;
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        columnState: TextState
    ) => void;
    onContextMenu?: (
        event: KonvaEventObject<MouseEvent>,
        columnState: TextState
    ) => void;
}> = ({
    cellHeight,
    cellWidth,
    gridIndex,
    gridId,
    patternIndex,
    marginY,
    rows,
    isSelected,
    onClick,
    onContextMenu,
}) => {
    const { styles } = useBeadeeGridStyles();

    const handleOnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, {
                relativeIndex: gridIndex,
                absoluteIndex: patternIndex,
                gridId,
            });
        },
        [onClick, gridIndex, patternIndex, gridId]
    );

    const handleOnContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, {
                relativeIndex: gridIndex,
                absoluteIndex: patternIndex,
                gridId,
            });
        },
        [onContextMenu, gridIndex, patternIndex, gridId]
    );

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
                fill={styles.components.text.color}
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
                fill={styles.components.text.color}
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
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                x={selectedColumnPositionX}
                y={selectedColumnPositionY}
                visible={isSelected}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
        </Fragment>
    );
};

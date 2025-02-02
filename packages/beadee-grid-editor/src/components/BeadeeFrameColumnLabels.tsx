import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { ColumnEvent } from "../types";
import { useBeadeeGridStyles, useBeadeeRenderBounds } from "../hooks";

export const BeadeeFrameColumnLabels: FC<{
    cellHeight: number;
    cellWidth: number;
    columnIndex: number;
    marginY: number;
    isSelected: boolean;
    onClick?: (
        event: KonvaEventObject<MouseEvent>,
        source: ColumnEvent
    ) => void;
    onContextMenu?: (
        event: KonvaEventObject<MouseEvent>,
        source: ColumnEvent
    ) => void;
}> = ({
    cellHeight,
    cellWidth,
    columnIndex,
    marginY,
    isSelected,
    onClick,
    onContextMenu,
}) => {
    const { styles } = useBeadeeGridStyles();
    const { position, height } = useBeadeeRenderBounds();

    const handleOnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, { columnIndex });
        },
        [onClick, columnIndex]
    );

    const handleOnContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, { columnIndex });
        },
        [onContextMenu, columnIndex]
    );

    const topTextPosition = {
        x: position.x + columnIndex * cellWidth,
        y: position.y - cellHeight - marginY,
    };
    const bottomTextPosition = {
        x: position.x + columnIndex * cellWidth,
        y: position.y + height + marginY,
    };
    const selectedColumnHeight =
        bottomTextPosition.y - topTextPosition.y + cellHeight;

    return (
        <Fragment>
            <Text
                key={`column-top-number-${columnIndex}`}
                align={"center"}
                verticalAlign={"middle"}
                fill={styles.components.text.color}
                height={cellHeight}
                width={cellWidth}
                x={topTextPosition.x}
                y={topTextPosition.y}
                text={(columnIndex + 1).toString()}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
            <Text
                key={`column-bottom-number-${columnIndex}`}
                align={"center"}
                verticalAlign={"middle"}
                fill={styles.components.text.color}
                height={cellHeight}
                width={cellWidth}
                x={bottomTextPosition.x}
                y={bottomTextPosition.y}
                text={(columnIndex + 1).toString()}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
            <Rect
                key={"selected-column-frame"}
                cornerRadius={20}
                height={selectedColumnHeight}
                width={cellWidth}
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                x={topTextPosition.x}
                y={topTextPosition.y}
                visible={isSelected}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
        </Fragment>
    );
};

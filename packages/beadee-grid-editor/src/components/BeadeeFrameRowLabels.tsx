import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { RowEvent } from "../types";
import { useBeadeeGridStyles, useBeadeeRenderBounds } from "../hooks";

export const BeadingFrameRowLabels: FC<{
    cellHeight: number;
    cellWidth: number;
    rowIndex: number;
    marginX: number;
    isSelected: boolean;
    onClick?: (event: KonvaEventObject<MouseEvent>, source: RowEvent) => void;
    onContextMenu?: (
        event: KonvaEventObject<MouseEvent>,
        source: RowEvent
    ) => void;
}> = ({
    cellHeight,
    cellWidth,
    rowIndex,
    marginX,
    isSelected,
    onClick,
    onContextMenu,
}) => {
    const { styles } = useBeadeeGridStyles();
    const { position, width } = useBeadeeRenderBounds();

    const handleOnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, { rowIndex });
        },
        [onClick, rowIndex]
    );

    const handleOnContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, { rowIndex });
        },
        [onContextMenu, rowIndex]
    );

    const leftTextPosition = {
        x: position.x - cellWidth - marginX,
        y: position.y + rowIndex * cellHeight,
    };
    const rightTextPosition = {
        x: position.x + width + marginX,
        y: position.y + rowIndex * cellHeight,
    };
    const selectedRowWidth =
        rightTextPosition.x - leftTextPosition.x + cellWidth;

    return (
        <Fragment>
            <Text
                key={`row-left-number-${rowIndex}`}
                align={"right"}
                verticalAlign={"middle"}
                fill={styles.components.text.color}
                height={cellHeight}
                width={cellWidth}
                x={leftTextPosition.x}
                y={leftTextPosition.y}
                text={(rowIndex + 1).toString()}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
            <Text
                key={`row-right-number-${rowIndex}`}
                align={"left"}
                verticalAlign={"middle"}
                fill={styles.components.text.color}
                height={cellHeight}
                width={cellWidth}
                x={rightTextPosition.x}
                y={rightTextPosition.y}
                text={(rowIndex + 1).toString()}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
            <Rect
                key={"selected-row-frame"}
                cornerRadius={20}
                height={cellHeight}
                width={selectedRowWidth}
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                x={leftTextPosition.x}
                y={leftTextPosition.y}
                visible={isSelected}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
        </Fragment>
    );
};

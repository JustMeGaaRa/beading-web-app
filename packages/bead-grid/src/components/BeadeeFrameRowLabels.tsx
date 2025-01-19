import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, Fragment } from "react";
import { Rect, Text } from "react-konva";
import { TextState } from "../types";
import { useGridStyles } from "../hooks";

export const BeadingFrameRowLabels: FC<{
    cellHeight: number;
    cellWidth: number;
    gridIndex: number;
    gridId: string;
    patternIndex: number;
    marginX: number;
    columns: number;
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
    marginX,
    columns,
    isSelected,
    onClick,
    onContextMenu,
}) => {
    const { styles } = useGridStyles();

    const handleOnClick = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onClick?.(event, { gridIndex, patternIndex, gridId });
        },
        [onClick, gridIndex, patternIndex, gridId]
    );

    const handleOnContextMenu = useCallback(
        (event: KonvaEventObject<MouseEvent>) => {
            onContextMenu?.(event, { gridIndex, patternIndex, gridId });
        },
        [onContextMenu, gridIndex, patternIndex, gridId]
    );

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
                fill={styles.components.text.color}
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
                fill={styles.components.text.color}
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
                stroke={styles.components.frame.selection.borderColor}
                strokeWidth={styles.components.frame.selection.borderWidth}
                x={selectedRowPositionX}
                y={selectedRowPositionY}
                visible={isSelected}
                onClick={handleOnClick}
                onContextMenu={handleOnContextMenu}
            />
        </Fragment>
    );
};

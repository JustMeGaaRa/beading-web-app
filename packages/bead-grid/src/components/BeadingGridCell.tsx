import { FC, useCallback, Fragment } from "react";
import { Rect, Circle } from "react-konva";
import { BeadingGridOffset, BeadingPointerEvent } from "../types";
import {
    CELL_BLANK_COLOR,
    CELL_BORDER_COLOR,
    FRAME_SELECTED_FILL_COLOR,
    FRAME_SELECTED_BORDER_COLOR,
    CELL_DOT_COLOR
} from "../constants";
import {
    getGridCellOffset,
    getGridCellRenderSize,
    isNullOrEmpty
} from "../utils";
import { useGrid, useGridStyles } from "../hooks";

export const BeadingGridCell: FC<{
    color: string;
    offset: BeadingGridOffset;
    isSelected?: boolean;
    onClick?: (event: BeadingPointerEvent) => void;
    onPointerDown?: (event: BeadingPointerEvent) => void;
    onPointerUp?: (event: BeadingPointerEvent) => void;
    onPointerOver?: (event: BeadingPointerEvent) => void;
    onPointerEnter?: (event: BeadingPointerEvent) => void;
}> = ({
    color,
    offset,
    isSelected,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerEnter,
}) => {
        const { styles } = useGridStyles();
        const { options } = useGrid();

        const { x, y } = getGridCellOffset(offset, options, styles);
        const { height, width } = getGridCellRenderSize(options, styles);

        const handleOnClick = useCallback(() => {
            onClick?.({ cell: { offset, color } });
        }, [onClick, offset, color]);

        const handleOnPointerDown = useCallback(() => {
            onPointerDown?.({ cell: { offset, color } });
        }, [onPointerDown, offset, color]);

        const handleOnPointerUp = useCallback(() => {
            onPointerUp?.({ cell: { offset, color } });
        }, [onPointerUp, offset, color]);

        const handleOnPointerOver = useCallback(() => {
            onPointerOver?.({ cell: { offset, color } });
        }, [onPointerOver, offset, color]);

        const handleOnPointerEnter = useCallback(() => {
            onPointerEnter?.({ cell: { offset, color } });
        }, [onPointerEnter, offset, color]);

        return (
            <Fragment>
                <Rect
                    cornerRadius={2}
                    fill={color}
                    height={height}
                    stroke={isNullOrEmpty(color) ? CELL_BLANK_COLOR : CELL_BORDER_COLOR}
                    strokeWidth={1}
                    width={width}
                    x={x}
                    y={y}
                    onClick={handleOnClick}
                    onTap={handleOnClick}
                    onPointerDown={handleOnPointerDown}
                    onPointerUp={handleOnPointerUp}
                    onPointerOver={handleOnPointerOver}
                    onPointerEnter={handleOnPointerEnter}
                />
                {isSelected && (
                    <Rect
                        cornerRadius={2}
                        fill={FRAME_SELECTED_FILL_COLOR}
                        height={height}
                        opacity={0.3}
                        stroke={FRAME_SELECTED_BORDER_COLOR}
                        strokeWidth={2}
                        width={width}
                        x={x}
                        y={y}
                        onClick={handleOnClick}
                        onTap={handleOnClick}
                        onPointerDown={handleOnPointerDown}
                        onPointerUp={handleOnPointerUp}
                        onPointerOver={handleOnPointerOver}
                        onPointerEnter={handleOnPointerEnter}
                    />
                )}
                {isNullOrEmpty(color) && (
                    <Circle
                        fill={CELL_DOT_COLOR}
                        height={4}
                        width={4}
                        x={x + width / 2}
                        y={y + height / 2}
                        onClick={handleOnClick}
                    />
                )}
            </Fragment>
        );
    };

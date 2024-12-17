import { FC, useCallback, Fragment } from "react";
import { Rect, Circle } from "react-konva";
import { BeadingPointerEvent } from "../types";
import { CELL_BLANK_COLOR, CELL_BORDER_COLOR, FRAME_SELECTED_FILL_COLOR, FRAME_SELECTED_BORDER_COLOR, CELL_DOT_COLOR } from "../constants";
import { isNullOrEmpty } from "../utils";

export const GridCell: FC<{
    color: string;
    columnIndex: number;
    rowIndex: number;
    height: number;
    width: number;
    position: { x: number; y: number; };
    isSelected?: boolean;
    onClick?: (event: BeadingPointerEvent) => void;
    onPointerDown?: (event: BeadingPointerEvent) => void;
    onPointerUp?: (event: BeadingPointerEvent) => void;
    onPointerOver?: (event: BeadingPointerEvent) => void;
    onPointerEnter?: (event: BeadingPointerEvent) => void;
}> = ({
    color, columnIndex, rowIndex, height, width, position, isSelected, onClick, onPointerDown, onPointerUp, onPointerOver, onPointerEnter,
}) => {
        const handleOnClick = useCallback(() => {
            onClick?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onClick, rowIndex, columnIndex, color]);

        const handleOnPointerDown = useCallback(() => {
            onPointerDown?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerDown, rowIndex, columnIndex, color]);

        const handleOnPointerUp = useCallback(() => {
            onPointerUp?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerUp, rowIndex, columnIndex, color]);

        const handleOnPointerOver = useCallback(() => {
            onPointerOver?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerOver, rowIndex, columnIndex, color]);

        const handleOnPointerEnter = useCallback(() => {
            onPointerEnter?.({ cell: { offset: { rowIndex, columnIndex }, color } });
        }, [onPointerEnter, rowIndex, columnIndex, color]);

        return (
            <Fragment>
                <Rect
                    cornerRadius={2}
                    fill={color}
                    height={height}
                    stroke={isNullOrEmpty(color) ? CELL_BLANK_COLOR : CELL_BORDER_COLOR}
                    strokeWidth={1}
                    width={width}
                    x={position.x}
                    y={position.y}
                    onClick={handleOnClick}
                    onTap={handleOnClick}
                    onPointerDown={handleOnPointerDown}
                    onPointerUp={handleOnPointerUp}
                    onPointerOver={handleOnPointerOver}
                    onPointerEnter={handleOnPointerEnter} />
                {isSelected && (
                    <Rect
                        cornerRadius={2}
                        fill={FRAME_SELECTED_FILL_COLOR}
                        height={height}
                        opacity={0.3}
                        stroke={FRAME_SELECTED_BORDER_COLOR}
                        strokeWidth={2}
                        width={width}
                        x={position.x}
                        y={position.y}
                        onClick={handleOnClick}
                        onTap={handleOnClick}
                        onPointerDown={handleOnPointerDown}
                        onPointerUp={handleOnPointerUp}
                        onPointerOver={handleOnPointerOver}
                        onPointerEnter={handleOnPointerEnter} />
                )}
                {isNullOrEmpty(color) && (
                    <Circle
                        fill={CELL_DOT_COLOR}
                        height={4}
                        width={4}
                        x={position.x + width / 2}
                        y={position.y + height / 2}
                        onClick={handleOnClick} />
                )}
            </Fragment>
        );
    };

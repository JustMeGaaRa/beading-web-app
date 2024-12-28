import { FC, useCallback, Fragment } from "react";
import { Rect } from "react-konva";
import { BeadingGridOffset, BeadingPointerEvent } from "../types";
import { getGridCellOffset, getGridCellRenderSize } from "../utils";
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
                {!isSelected ? (
                    <Rect
                        cornerRadius={styles.components.cell.borderRadius}
                        fill={color}
                        height={height}
                        listening={false}
                        stroke={styles.components.cell.borderColor}
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
                ) : (
                    <Rect
                        cornerRadius={styles.components.cell._selected.borderRadius}
                        fill={styles.components.cell._selected.backgroundColor}
                        height={height}
                        listening={false}
                        opacity={0.3}
                        stroke={styles.components.cell._selected.borderColor}
                        strokeWidth={styles.components.cell._selected.borderWidth}
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
            </Fragment>
        );
    };

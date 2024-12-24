import { KonvaEventObject } from "konva/lib/Node";
import { FC } from "react";
import { Rect } from "react-konva";
import { useGridStyles } from "../hooks";
import { BeadingGridOffset, BeadingGridState } from "../types";
import { getGridActualHeight } from "../utils";

export const HighlightedArea: FC<{
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    offset: BeadingGridOffset;
    height: number;
    width: number;
    grid: BeadingGridState;
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
}> = ({
    backgroundColor,
    borderColor,
    borderWidth,
    offset,
    height,
    width,
    grid,
    onClick,
}) => {
        const { styles } = useGridStyles();

        const topBoundary = 0;
        const leftBoundary = 0;
        const rightBoundary = getGridActualHeight(grid.options) - offset.rowIndex;
        const bottomBoundary = grid.options.width - offset.columnIndex;

        const truncatedColumnIndex = Math.min(Math.max(topBoundary, offset.columnIndex), (grid.options.width));
        const truncatedRowIndex = Math.min(Math.max(leftBoundary, offset.rowIndex), getGridActualHeight(grid.options));
        const truncatedHeight = Math.min(offset.rowIndex < 0 ? height + offset.rowIndex : height, rightBoundary);
        const truncatedWidth = Math.min(offset.columnIndex < 0 ? width + offset.columnIndex : width, bottomBoundary);

        const areaX = truncatedColumnIndex * styles.bead.width * styles.rendering.pixelPerPoint;
        const areaY = truncatedRowIndex * styles.bead.height * styles.rendering.pixelPerPoint;
        const areaHeight = truncatedHeight * styles.bead.height * styles.rendering.pixelPerPoint;
        const areaWidth = truncatedWidth * styles.bead.width * styles.rendering.pixelPerPoint;

        return (
            <Rect
                fill={backgroundColor}
                listening={!!backgroundColor}
                opacity={0.3}
                stroke={borderColor}
                strokeWidth={borderWidth}
                height={areaHeight}
                width={areaWidth}
                x={areaX}
                y={areaY}
                onClick={onClick}
                onTap={onClick} />
        );
    };

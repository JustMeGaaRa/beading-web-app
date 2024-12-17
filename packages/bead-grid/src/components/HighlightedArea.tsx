import { KonvaEventObject } from "konva/lib/Node";
import { FC } from "react";
import { Rect } from "react-konva";
import { useGridOptions } from "../hooks";
import { BeadingGridOffset, BeadingGridState } from "../types";

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
    backgroundColor, borderColor, borderWidth, offset, height, width, grid, onClick,
}) => {
        const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

        const topBoundary = 0;
        const leftBoundary = 0;
        const rightBoundary = grid.rows.length - offset.rowIndex;
        const bottomBoundary = (grid.rows[0]?.cells.length ?? 0) - offset.columnIndex;

        const truncatedColumnIndex = Math.min(Math.max(topBoundary, offset.columnIndex), (grid.rows[0]?.cells.length ?? 0));
        const truncatedRowIndex = Math.min(Math.max(leftBoundary, offset.rowIndex), grid.rows.length);
        const truncatedHeight = Math.min(offset.rowIndex < 0 ? height + offset.rowIndex : height, rightBoundary);
        const truncatedWidth = Math.min(offset.columnIndex < 0 ? width + offset.columnIndex : width, bottomBoundary);

        const areaX = truncatedColumnIndex * cellWidth * pointPixelRatio;
        const areaY = truncatedRowIndex * cellHeight * pointPixelRatio;
        const areaHeight = truncatedHeight * cellHeight * pointPixelRatio;
        const areaWidth = truncatedWidth * cellWidth * pointPixelRatio;

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

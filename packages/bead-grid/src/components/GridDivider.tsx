import { FC } from "react";
import { Line } from "react-konva";
import { useGridOptions } from "../hooks";
import { BeadingGridOffset } from "../types";

export const GridDivider: FC<{
    length: number;
    offset: BeadingGridOffset;
    orientation: "horizontal" | "vertical";
    strokeColor?: string;
    strokeWidth?: number;
}> = ({
    length, offset, orientation, strokeColor, strokeWidth = 1,
}) => {
        const { cellHeight, cellWidth, pointPixelRatio } = useGridOptions();

        const positionX1 = offset.columnIndex * cellWidth * pointPixelRatio;
        const positionY1 = offset.rowIndex * cellHeight * pointPixelRatio;
        const positionX2 = orientation === "horizontal"
            ? (offset.columnIndex + length) * cellWidth * pointPixelRatio
            : offset.columnIndex * cellWidth * pointPixelRatio;
        const positionY2 = orientation === "horizontal"
            ? offset.rowIndex * cellHeight * pointPixelRatio
            : (offset.rowIndex + length) * cellHeight * pointPixelRatio;

        return (
            <Line
                points={[positionX1, positionY1, positionX2, positionY2]}
                stroke={strokeColor}
                strokeWidth={strokeWidth} />
        );
    };

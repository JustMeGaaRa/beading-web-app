import { FC } from "react";
import { Line } from "react-konva";
import { useGrid, useGridStyles } from "../hooks";
import { BeadingGridOffset } from "../types";
import { flipBead } from "../utils";

export const BeadingGridDivider: FC<{
    length: number;
    offset: BeadingGridOffset;
    orientation: "horizontal" | "vertical";
    strokeColor?: string;
    strokeWidth?: number;
}> = ({
    length,
    offset,
    orientation,
    strokeColor,
    strokeWidth = 1,
}) => {
        const { styles } = useGridStyles();
        const { options } = useGrid();
        const bead = options.type === "brick" ? flipBead(styles.bead) : styles.bead;

        const positionX1 = offset.columnIndex * bead.width * styles.rendering.pixelPerPoint;
        const positionY1 = offset.rowIndex * bead.height * styles.rendering.pixelPerPoint;
        const positionX2 = orientation === "horizontal"
            ? (offset.columnIndex + length) * bead.width * styles.rendering.pixelPerPoint
            : offset.columnIndex * bead.width * styles.rendering.pixelPerPoint;
        const positionY2 = orientation === "horizontal"
            ? offset.rowIndex * bead.height * styles.rendering.pixelPerPoint
            : (offset.rowIndex + length) * bead.height * styles.rendering.pixelPerPoint;

        return (
            <Line
                points={[positionX1, positionY1, positionX2, positionY2]}
                stroke={strokeColor}
                strokeWidth={strokeWidth} />
        );
    };

import { FC } from "react";
import { Line } from "react-konva";
import { useBeadeeGridStyles, useBeadeeRenderBounds } from "../hooks";
import { RenderPoint } from "../types";

type RenderRect = {
    topLeft: RenderPoint;
    topRight: RenderPoint;
    bottomLeft: RenderPoint;
    bottomRight: RenderPoint;
};

export const BeadeeGridDivider: FC<{
    placement?: "start" | "end";
    orientation: "horizontal" | "vertical";
    strokeColor?: string;
    strokeWidth?: number;
}> = ({ placement = "end", orientation, strokeColor, strokeWidth }) => {
    const { styles } = useBeadeeGridStyles();
    const { position, height, width } = useBeadeeRenderBounds();

    const place = ({
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
    }: RenderRect) => {
        return orientation === "horizontal"
            ? placement === "start"
                ? { point1: topLeft, point2: topRight }
                : { point1: bottomLeft, point2: bottomRight }
            : placement === "start"
              ? { point1: topLeft, point2: bottomLeft }
              : { point1: topRight, point2: bottomRight };
    };

    const topLeft = { x: position.x, y: position.y };
    const topRight = { x: position.x + width, y: position.y };
    const bottomLeft = { x: position.x, y: position.y + height };
    const bottomRight = { x: position.x + width, y: position.y + height };

    const { point1, point2 } = place({
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
    });

    return (
        <Line
            points={[point1.x, point1.y, point2.x, point2.y]}
            stroke={strokeColor ?? styles.components.divider.strokeColor}
            strokeWidth={strokeWidth ?? styles.components.divider.strokeWidth}
        />
    );
};

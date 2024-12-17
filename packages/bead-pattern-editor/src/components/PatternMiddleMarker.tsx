import { CELL_DOT_COLOR, CELL_BLANK_COLOR } from "@repo/bead-grid";
import { FC } from "react";
import { Group, Line } from "react-konva";

export const PatternMiddleMarker: FC<{
    orientation: "horizontal" | "vertical";
    x: number;
    y: number;
    height: number;
    width: number;
}> = ({
    orientation, x, y, height, width
}) => {
        return (
            <Group x={x} y={y}>
                {orientation === "vertical" ? (
                    <Line
                        points={[
                            -width / 2,
                            -height / 2,
                            width / 2,
                            -height / 2,
                            0,
                            height / 2
                        ]}
                        closed
                        fill={CELL_DOT_COLOR}
                        stroke={CELL_BLANK_COLOR}
                        strokeWidth={0}
                        scale={{ x: 0.5, y: 0.7 }} />
                ) : (
                    <Line
                        points={[
                            -width / 2,
                            -height / 2,
                            width / 2,
                            0,
                            -width / 2,
                            height / 2
                        ]}
                        closed
                        fill={CELL_DOT_COLOR}
                        stroke={CELL_BLANK_COLOR}
                        strokeWidth={0}
                        scale={{ x: 0.7, y: 0.5 }} />
                )}
            </Group>
        );
    };

import { FC } from "react";
import { Group, Line } from "react-konva";
import { useGridStyles } from "../hooks";

export const BeadeeFrameMiddleMarker: FC<{
    orientation: "horizontal" | "vertical";
    x: number;
    y: number;
    height: number;
    width: number;
}> = ({ orientation, x, y, height, width }) => {
    const { styles } = useGridStyles();

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
                        height / 2,
                    ]}
                    closed
                    fill={styles.components.frame.marker.backgroundColor}
                    stroke={styles.components.frame.marker.borderColor}
                    strokeWidth={styles.components.frame.marker.borderWidth}
                    scale={{ x: 0.5, y: 0.7 }}
                />
            ) : (
                <Line
                    points={[
                        -width / 2,
                        -height / 2,
                        width / 2,
                        0,
                        -width / 2,
                        height / 2,
                    ]}
                    closed
                    fill={styles.components.frame.marker.backgroundColor}
                    stroke={styles.components.frame.marker.borderColor}
                    strokeWidth={styles.components.frame.marker.borderWidth}
                    scale={{ x: 0.7, y: 0.5 }}
                />
            )}
        </Group>
    );
};
